import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { prisma } from '../../../lib/prisma.js';
import { getLeadContextTool, updateLeadQualificationTool } from '../tools/crmTools.js';
import { searchPlaybookTool } from '../tools/playbookTool.js';
import { HumanMessage } from '@langchain/core/messages';
import { getChatModel, logAiUsage } from '../../../lib/ai/gateway.js';

// Usa a mesma factory do gateway central (LiteLLM), em vez de instanciar seu próprio ChatOpenAI —
// mantém um único ponto de configuração de URL/key/modelo para todos os motores de IA.
const llm = getChatModel('gpt-4o-mini', 0);

const tools = [getLeadContextTool, searchPlaybookTool, updateLeadQualificationTool];

export class SDRAgent {
    async run(leadId: string, sessionId?: string) {
        const agent = createReactAgent({
            llm,
            tools,
            messageModifier: `Você é a IA principal de Pré-Vendas (SDR Autônomo) da Atlas, arquitetada para qualificação cirúrgica de leads B2B (transportadoras e embarcadores).
Sua missão não é apenas ler dados, mas EXECUTAR UMA ANÁLISE DE RISCO LOGÍSTICO COMPLETA baseada no ICP.
DIRETRIZES DE EXECUÇÃO:
1. USE FERRAMENTAS: Obtenha os dados do Lead com 'get_lead_context' e, SEMPRE que não tiver clareza do critério, use 'search_playbook' para investigar 'ICP da Atlas'.
2. RACIOCÍNIO FRIO: Analise o Fit Score (0 a 100) baseando-se ESTRITAMENTE em porte (frota, faturamento), situação cadastral e aderência ao segmento de logística/transporte. Jamais adicione pontos por simpatia.
3. SAÍDA FINAL OBRIGATÓRIA: Após compilar as evidências, USE a ferramenta 'update_lead_qualification'. 
   - A nota deve refletir a realidade crua dos dados.
   - O status deve ser 'Primeiro_Contato' apenas para leads com nota > 75, caso contrário 'Qualificacao' ou 'Descartado'.
   - O resumo DEVE SER direto, ex: "Fit alto (85). Faturamento X, frota Y. Dor presumida: gestão de exceções."
Trabalhe silenciosamente e não faça perguntas ao usuário. Aja até completar a tarefa chamando 'update_lead_qualification'.`
        });

        const inputs = {
            messages: [new HumanMessage(`Por favor, inicie a análise e qualificação do lead com o ID: ${leadId}`)]
        };

        const startTime = Date.now();
        const result = await agent.invoke(inputs);
        const latencyMs = Date.now() - startTime;

        // O ReAct loop pode chamar o modelo várias vezes (uma por rodada de tool call) — somamos o
        // uso reportado em cada mensagem de IA da trajetória para logar o custo real da execução.
        const totalUsage = result.messages.reduce(
            (acc: { totalTokens: number; promptTokens: number; completionTokens: number }, m: any) => {
                const u = m.usage_metadata;
                if (u) {
                    acc.totalTokens += u.total_tokens ?? 0;
                    acc.promptTokens += u.input_tokens ?? 0;
                    acc.completionTokens += u.output_tokens ?? 0;
                }
                return acc;
            },
            { totalTokens: 0, promptTokens: 0, completionTokens: 0 },
        );
        if (totalUsage.totalTokens > 0) {
            await logAiUsage({ model: 'gpt-4o-mini', usage: totalUsage, latencyMs });
        }

        const sid = sessionId || `session-${leadId}-${Date.now()}`;

        // Salvar a trilha de pensamento e memória no banco para auditoria
        await this.updateMemory(sid, result.messages.map((m: any) => ({
            role: m._getType(),
            content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
            tool_calls: m.tool_calls || undefined
        })));

        return { success: true, sessionId: sid };
    }

    private async updateMemory(sessionId: string, messages: any) {
        await prisma.agentMemory.create({
            data: {
                sessionId,
                agentType: 'SDR',
                messages
            }
        });
    }
}
