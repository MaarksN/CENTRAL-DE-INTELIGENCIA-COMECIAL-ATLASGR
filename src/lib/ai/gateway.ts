import { GoogleGenAI } from '@google/genai';
import type { BaseMessage } from '@langchain/core/messages';

// Chamamos a API do Gemini diretamente (via SDK oficial @google/genai) em vez de depender
// de um proxy LiteLLM rodando em Docker — uma dependência a menos entre "configurar a chave"
// e "a IA responder". Se no futuro for necessário rotear para outros provedores (GPT, Claude,
// etc.), o LITELLM_URL continua disponível como alternativa (ver getAiModelViaLiteLLM abaixo).
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Apelidos usados no restante do código (ai.service.ts, leadQualification.ts) mapeados para os
// nomes de modelo reais da API Gemini. Usamos os aliases "-latest" para não quebrar de novo
// quando a Google aposentar uma versão pontual (foi o que aconteceu com gemini-1.5-*).
const MODEL_ALIASES: Record<string, string> = {
    'gemini-pro': 'gemini-pro-latest',
    'gemini-flash': 'gemini-flash-latest',
};

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
    if (!GEMINI_API_KEY) {
        throw new Error(
            'GEMINI_API_KEY não configurada. Gere uma chave gratuita em https://aistudio.google.com/apikey (formato AIzaSy...) e defina GEMINI_API_KEY no .env.'
        );
    }
    if (!cachedClient) {
        cachedClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }
    return cachedClient;
}

function messagesToPrompt(messages: BaseMessage[]): string {
    return messages
        .map((m) => (typeof m.content === 'string' ? m.content : JSON.stringify(m.content)))
        .join('\n\n');
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

/**
 * Retorna um "chat model" mínimo compatível com o padrão `.invoke([HumanMessage])` do LangChain,
 * mas que por baixo dos panos chama a Gemini API diretamente — sem depender do container LiteLLM.
 */
export const getAiModel = (modelName: string = 'gemini-pro', temperature: number = 0.7): AiChatModel => {
    const resolvedModel = MODEL_ALIASES[modelName] || modelName;

    return {
        async invoke(messages: BaseMessage[]): Promise<AiInvokeResult> {
            const ai = getClient();
            const prompt = messagesToPrompt(messages);

            let response;
            try {
                response = await ai.models.generateContent({
                    model: resolvedModel,
                    contents: prompt,
                    config: { temperature },
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`Falha ao chamar a Gemini API (modelo ${resolvedModel}): ${message}`);
            }

            const usage = response.usageMetadata;
            return {
                content: response.text ?? '',
                response_metadata: {
                    model: resolvedModel,
                    tokenUsage: {
                        totalTokens: usage?.totalTokenCount ?? 0,
                        promptTokens: usage?.promptTokenCount ?? 0,
                        completionTokens: usage?.candidatesTokenCount ?? 0,
                    },
                },
            };
        },
    };
};

// Preço aproximado por 1M de tokens (USD) — usado só para estimar custo no AILog, não é cobrança real.
const PRICING_PER_MILLION_TOKENS: Record<string, { input: number; output: number }> = {
    'gemini-flash-latest': { input: 0.075, output: 0.3 },
    'gemini-pro-latest': { input: 1.25, output: 5.0 },
};

export function estimateCostUsd(model: string, usage: AiTokenUsage): number {
    const pricing = PRICING_PER_MILLION_TOKENS[model] ?? PRICING_PER_MILLION_TOKENS['gemini-flash-latest'];
    return (usage.promptTokens / 1_000_000) * pricing.input + (usage.completionTokens / 1_000_000) * pricing.output;
}
