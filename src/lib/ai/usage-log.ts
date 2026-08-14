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

        await prisma.$transaction(async (tx) => {
            // SQL constante, sem entrada do usuário. O SET LOCAL morre junto com esta transação.
            await tx.$executeRawUnsafe("SET LOCAL app.allow_unattributed_ailog = 'on'");
            await tx.aILog.create({ data });
        });
    } catch (error) {
        // Telemetria nunca deve derrubar a resposta útil ao usuário.
        logger.warn({ err: error, model: input.model }, 'Unable to persist AI usage log');
    }
};
