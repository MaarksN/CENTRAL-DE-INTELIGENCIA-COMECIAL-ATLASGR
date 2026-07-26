import type { BaseMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { prisma } from '../prisma.js';
import { logger } from '../logger.js';

// Constantes da API
export const GEMINI_MODEL = 'gemini-2.5-pro';

// Apelidos usados no restante do código (ai.service.ts, leadQualification.ts, agentes) mapeados para
// os nomes de modelo reais configurados no litellm-config.yaml. Usamos os aliases "-latest" da Gemini
// para não quebrar de novo quando a Google aposentar uma versão pontual (foi o que aconteceu com
// gemini-1.5-*), e o model_name do LiteLLM para os demais provedores.
const MODEL_ALIASES: Record<string, string> = {
    'gemini-pro': 'gemini-pro-latest',
    'gemini-flash': 'gemini-flash-latest',
    'gpt-4o': 'gpt-4o',
    'gpt-4o-mini': 'gpt-4o-mini',
    'claude-sonnet': 'claude-sonnet',
};

// Cadeia de fallback por apelido — espelha `litellm_settings.fallbacks` do litellm-config.yaml.
// Se o modelo pedido falhar (timeout, rate limit, provedor fora do ar) depois de esgotar as
// tentativas, tentamos o próximo modelo da lista antes de desistir de vez.
const FALLBACK_CHAIN: Record<string, string[]> = {
    'gemini-pro': ['gemini-flash'],
    'gemini-flash': [],
    'gpt-4o': ['gemini-pro'],
    'gpt-4o-mini': ['gemini-flash'],
    'claude-sonnet': ['gemini-pro'],
};

const MAX_ATTEMPTS_PER_MODEL = 3;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function toChatRole(type: string): 'system' | 'user' | 'assistant' {
    if (type === 'system') return 'system';
    if (type === 'ai' || type === 'assistant') return 'assistant';
    return 'user';
}

/** Aceita tanto mensagens reais do LangChain (BaseMessage) quanto os objetos "duck-typed"
 * `{ role, content }` usados por agent.service.ts, preservando o papel (system/user/assistant)
 * de cada mensagem em vez de achatar tudo num único prompt (o que perdia contexto multi-turn). */
function messagesToChatPayload(messages: BaseMessage[]): { role: string; content: string }[] {
    return messages.map((m: any) => {
        const rawType = typeof m._getType === 'function' ? m._getType() : (m.role ?? 'user');
        const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
        return { role: toChatRole(rawType), content };
    });
}

export interface AiTokenUsage {
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
}

export interface AiInvokeResult {
    content: string;
    response_metadata: { tokenUsage: AiTokenUsage; model: string };
}

export interface AiChatModel {
    invoke(messages: BaseMessage[]): Promise<AiInvokeResult>;
}

async function callLiteLLM(
    resolvedModel: string,
    messages: BaseMessage[],
    temperature: number,
    agentContext: string,
): Promise<AiInvokeResult> {
    const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:4000';
    const LITELLM_KEY = process.env.LITELLM_KEY || 'sk-litellm';

    const res = await fetch(`${LITELLM_URL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LITELLM_KEY}`,
        },
        body: JSON.stringify({
            model: resolvedModel,
            messages: messagesToChatPayload(messages),
            temperature,
            user: agentContext,
            metadata: { agent: agentContext },
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    const response = await res.json();
    const usage = response.usage;

    return {
        content: response.choices?.[0]?.message?.content ?? '',
        response_metadata: {
            model: response.model || resolvedModel,
            tokenUsage: {
                totalTokens: usage?.total_tokens ?? 0,
                promptTokens: usage?.prompt_tokens ?? 0,
                completionTokens: usage?.completion_tokens ?? 0,
            },
        },
    };
}

/**
 * Retorna um "chat model" mínimo compatível com o padrão `.invoke([HumanMessage])` do LangChain,
 * que chama o LiteLLM Gateway (proxy multi-provedor: Gemini, OpenAI, Claude, Ollama, OpenRouter —
 * ver litellm-config.yaml). Tenta até `MAX_ATTEMPTS_PER_MODEL` vezes por modelo (backoff exponencial)
 * e, se todas falharem, cai para o próximo modelo da cadeia de fallback antes de propagar o erro.
 */
export const getAiModel = (modelName: string = 'gemini-pro', temperature: number = 0.7, agentContext: string = 'system'): AiChatModel => {
    return {
        async invoke(messages: BaseMessage[]): Promise<AiInvokeResult> {
            const chain = [modelName, ...(FALLBACK_CHAIN[modelName] ?? [])];
            let lastError: unknown;

            for (const alias of chain) {
                const resolvedModel = MODEL_ALIASES[alias] || alias;

                for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
                    try {
                        return await callLiteLLM(resolvedModel, messages, temperature, agentContext);
                    } catch (error) {
                        lastError = error;
                        const message = error instanceof Error ? error.message : String(error);
                        logger.warn({ model: resolvedModel, attempt, agentContext, err: message }, 'Falha ao chamar o LiteLLM Gateway');
                        if (attempt < MAX_ATTEMPTS_PER_MODEL) {
                            await sleep(2 ** attempt * 200);
                        }
                    }
                }
            }

            const message = lastError instanceof Error ? lastError.message : String(lastError);
            throw new Error(`Falha ao chamar o LiteLLM Gateway (modelo ${modelName}, após fallback): ${message}`);
        },
    };
};

/**
 * Factory de `ChatOpenAI` (LangChain) apontada pro mesmo LiteLLM Gateway usado por `getAiModel`.
 * Usada pelos agentes LangGraph (`createReactAgent` e afins) que exigem um `Runnable` completo em
 * vez do wrapper mínimo `.invoke()` — mantém um único ponto de configuração de URL/key/modelo em
 * vez de cada agente instanciar seu próprio `ChatOpenAI` com valores hardcoded.
 */
export function getChatModel(modelName: string = 'gemini-flash', temperature: number = 0): ChatOpenAI {
    const resolvedModel = MODEL_ALIASES[modelName] || modelName;
    const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:4000';
    const LITELLM_KEY = process.env.LITELLM_KEY || 'sk-litellm';

    return new ChatOpenAI({
        modelName: resolvedModel,
        temperature,
        openAIApiKey: LITELLM_KEY,
        configuration: {
            baseURL: `${LITELLM_URL}/v1`,
        },
    });
}

// Preço aproximado por 1M de tokens (USD) — usado só para estimar custo no AILog, não é cobrança real.
const PRICING_PER_MILLION_TOKENS: Record<string, { input: number; output: number }> = {
    'gemini-flash-latest': { input: 0.075, output: 0.3 },
    'gemini-pro-latest': { input: 1.25, output: 5.0 },
    'gpt-4o': { input: 2.5, output: 10.0 },
    'gpt-4o-mini': { input: 0.15, output: 0.6 },
    'claude-sonnet': { input: 3.0, output: 15.0 },
};

export function estimateCostUsd(model: string, usage: AiTokenUsage): number {
    const pricing = PRICING_PER_MILLION_TOKENS[model] ?? PRICING_PER_MILLION_TOKENS['gemini-flash-latest'];
    return (usage.promptTokens / 1_000_000) * pricing.input + (usage.completionTokens / 1_000_000) * pricing.output;
}

/**
 * Grava o uso de um modelo de IA no `AILog` — extraído para uso comum por todos os motores (antes só
 * `ai.service.ts` logava; `agent.service.ts`, `leadQualification.ts` e os agentes LangGraph rodavam
 * "no escuro", sem custo/latência auditados). Nunca deve derrubar a resposta da IA por falha de log.
 */
export async function logAiUsage(params: {
    model: string;
    usage: AiTokenUsage;
    latencyMs: number;
    promptId?: string;
}): Promise<void> {
    try {
        const cost = estimateCostUsd(params.model, params.usage);
        await prisma.aILog.create({
            data: {
                tokens: params.usage.totalTokens,
                cost,
                latencyMs: params.latencyMs,
                model: params.model,
                promptId: params.promptId,
            },
        });
    } catch (error) {
        logger.error({ err: error, model: params.model }, 'Falha ao gravar AILog');
    }
}

/**
 * Gera um embedding (array de floats) para o texto fornecido.
 * Usado para a Memória Vetorial (RAG) do Agente SDR via pgvector.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
    const LITELLM_URL = process.env.LITELLM_URL || 'http://localhost:4000';
    const LITELLM_KEY = process.env.LITELLM_KEY || 'sk-litellm';

    const response = await fetch(`${LITELLM_URL}/v1/embeddings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LITELLM_KEY}`,
        },
        body: JSON.stringify({
            model: 'gemini/text-embedding-004',
            input: text,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to generate embedding: ${err}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
};
