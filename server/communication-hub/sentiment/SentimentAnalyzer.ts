export type Sentiment = 'positive' | 'neutral' | 'negative';

export class SentimentAnalyzer {
  private static negativeMarkers = ['not interested', 'stop', 'unsubscribe', 'frustrated'];
  private static positiveMarkers = ['great', 'interested', 'thanks', 'sounds good'];

  static analyze(message: string): Sentiment {
    const lower = message.toLowerCase();
    if (this.negativeMarkers.some((m) => lower.includes(m))) return 'negative';
    if (this.positiveMarkers.some((m) => lower.includes(m))) return 'positive';
    return 'neutral';
  }
}
