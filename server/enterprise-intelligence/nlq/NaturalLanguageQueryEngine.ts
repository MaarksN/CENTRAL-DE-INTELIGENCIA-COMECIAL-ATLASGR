export interface NLQResult {
  question: string;
  interpretedMetric: string;
  answer: string;
}

export class NaturalLanguageQueryEngine {
  private static metricKeywords: Record<string, string> = {
    arr: 'Annual Recurring Revenue',
    churn: 'Churn Rate',
    pipeline: 'Pipeline Value',
    win: 'Win Rate',
  };

  static async ask(question: string): Promise<NLQResult> {
    const lower = question.toLowerCase();
    const matchedKey = Object.keys(this.metricKeywords).find((k) => lower.includes(k));
    const interpretedMetric = matchedKey ? this.metricKeywords[matchedKey] : 'General Overview';

    return { question, interpretedMetric, answer: `Mock answer for "${interpretedMetric}".` };
  }
}
