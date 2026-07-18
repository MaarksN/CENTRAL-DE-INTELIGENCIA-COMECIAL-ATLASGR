import { Meilisearch } from 'meilisearch';
import { logger } from '../logger.js';

const MEILI_HOST = process.env.MEILI_HOST || 'http://localhost:7700';
const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY || 'prospector_meili_master_key';

export const meili = new Meilisearch({
    host: MEILI_HOST,
    apiKey: MEILI_MASTER_KEY,
});

/**
 * Enterprise Search Implementation
 * Indexes to maintain: 'leads', 'companies', 'contacts'
 */

export const initMeiliIndexes = async () => {
    try {
        await meili.createIndex('companies', { primaryKey: 'id' });
        await meili.index('companies').updateFilterableAttributes(['segment', 'city', 'state', 'status']);
        await meili.index('companies').updateSearchableAttributes(['tradeName', 'legalName', 'cnpj', 'segment', 'city']);

        await meili.createIndex('leads', { primaryKey: 'id' });
        await meili.index('leads').updateFilterableAttributes(['status', 'temperature', 'owner']);
        await meili.index('leads').updateSearchableAttributes(['company.tradeName', 'contact.name', 'contact.email']);

        logger.info('Meilisearch indexes initialized');
    } catch (err) {
        logger.error({ err }, 'Failed to initialize Meilisearch indexes');
    }
};
