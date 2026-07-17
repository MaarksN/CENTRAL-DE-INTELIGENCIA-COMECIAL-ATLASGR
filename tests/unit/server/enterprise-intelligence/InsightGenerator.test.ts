import { describe, it, expect, vi, afterEach } from 'vitest';
import { InsightGenerator } from '../../../../server/enterprise-intelligence/insights/InsightGenerator.js';
import { PgVectorStore } from '../../../../server/knowledge/vector-store/PgVectorStore.js';

describe('InsightGenerator', () => {
  afterEach(() => vi.restoreAllMocks());

  it('generates an insight derived from the number of retrieved references', async () => {
    vi.spyOn(PgVectorStore.prototype, 'search').mockResolvedValue([
      { documentId: 'doc-1', content: 'note', score: 0.9 },
      { documentId: 'doc-2', content: 'note 2', score: 0.8 },
    ]);

    const insights = await InsightGenerator.generateForAccount('acc-1');

    expect(insights).toHaveLength(1);
    expect(insights[0].summary).toMatch(/2 knowledge base references for account acc-1/);
  });
});
