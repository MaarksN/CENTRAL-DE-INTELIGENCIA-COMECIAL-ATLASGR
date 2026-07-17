import { RetrievalEngine } from '../../knowledge/retrieval/RetrievalEngine.js';

export interface Insight {
  title: string;
  summary: string;
  confidence: number;
}

export class InsightGenerator {
  private static retrieval = new RetrievalEngine();

  static async generateForAccount(accountId: string): Promise<Insight[]> {
    const context = await this.retrieval.search(`account:${accountId} recent activity`, 3);

    return [
      {
        title: 'Engagement Trend',
        summary: `Derived from ${context.length} knowledge base references for account ${accountId}.`,
        confidence: 0.72,
      },
    ];
  }
}
