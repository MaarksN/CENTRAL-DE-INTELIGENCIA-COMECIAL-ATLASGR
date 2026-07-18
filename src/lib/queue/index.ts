import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import { connection } from './redis.js';
import { logger } from '../logger.js';
import { aiService } from '../../features/intelligence/services/ai.service.js';

/**
 * Base queue setup. 
 * As an example for the Enterprise architecture, we'll setup a standard Lead Enrichment queue.
 */
export const LEADS_QUEUE_NAME = 'leads-enrichment';

export const leadsQueue = new Queue(LEADS_QUEUE_NAME, { connection });

export const leadsQueueEvents = new QueueEvents(LEADS_QUEUE_NAME, { connection });

leadsQueueEvents.on('completed', ({ jobId }) => {
    logger.info({ jobId }, 'Job completed in leads queue');
});

leadsQueueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.error({ jobId, failedReason }, 'Job failed in leads queue');
});

/**
 * Worker setup. In a real microservices architecture, this might run in a separate process.
 * For now, it runs alongside the main server.
 */
export const createLeadsWorker = () => {
    const worker = new Worker(LEADS_QUEUE_NAME, async (job: Job) => {
        logger.info({ jobId: job.id, data: job.data }, 'Processing lead enrichment job');
        
        try {
            const { leadId, companyInfo } = job.data;
            if (!leadId || !companyInfo) {
                throw new Error("Missing leadId or companyInfo in job data");
            }

            const qualificationResult = await aiService.qualifyLead(leadId, companyInfo);
            
            // In a full implementation, we'd save this to Prisma/Meilisearch here
            logger.info({ leadId, status: qualificationResult.status }, "Lead Qualified Successfully");

            return { success: true, processedAt: new Date().toISOString(), result: qualificationResult };
        } catch (error: any) {
            logger.error({ err: error }, 'Error during lead qualification');
            throw error;
        }
    }, { connection });

    worker.on('error', (err) => {
        logger.error({ err }, 'Worker error');
    });

    return worker;
};
