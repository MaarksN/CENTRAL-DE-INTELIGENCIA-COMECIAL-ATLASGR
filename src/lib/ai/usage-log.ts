import { randomUUID } from 'node:crypto';
import { prisma } from '../prisma.js';
import { logger } from '../logger.js';
import { requestContext } from '../async-context.js';
import { estimateCostUsd, type AiUsageLogInput } from './gateway-core.js';

/**
 * Persiste consumo de IA respeitando RLS.
 *
 * Chamadas com tenant usam o fluxo normal. Telemetria interna sem tenant recebe uma autorização
 * específica, local à transação e válida somente para AILog pela policy do banco. Não reutiliza
 * app.bypass_rls e, portanto, não abre acesso às demais tabelas.
 *
 * O INSERT interno é SQL parametrizado e deliberadamente não usa RETURNING. Assim a policy de
 * SELECT continua fechada para organizationId=NULL; a aplicação não precisa ganhar permissão de
 * leitura só para o Prisma devolver a linha que acabou de inserir.
 */
export const logAiUsage = async (input: AiUsageLogInput): Promise<void> => {
    const organizationId = requestContext.getStore()?.tenantId ?? null;
    const data = {
        model: input.model,
        tokens: input.usage.totalTokens,
        cost: estimateCostUsd(input.model, input.usage),
        latencyMs: input.latencyMs,
        promptId: input.promptId,
        organizationId,
    };

    try {
        if (organizationId) {
            await prisma.aILog.create({ data });
            return;
        }

        const id = randomUUID();
        await prisma.$transaction(async (tx) => {
            // SQL constante, sem entrada do usuário. O SET LOCAL morre junto com esta transação.
            await tx.$executeRawUnsafe("SET LOCAL app.allow_unattributed_ailog = 'on'");
            await tx.$executeRaw`
                INSERT INTO "AILog"
                    ("id", "tokens", "cost", "latencyMs", "model", "promptId", "organizationId", "createdAt")
                VALUES
                    (${id}, ${data.tokens}, ${data.cost}, ${data.latencyMs}, ${data.model}, ${data.promptId ?? null}, NULL, CURRENT_TIMESTAMP)
            `;
        });
    } catch (error) {
        // Telemetria nunca deve derrubar a resposta útil ao usuário.
        logger.warn({ err: error, model: input.model }, 'Unable to persist AI usage log');
    }
};
