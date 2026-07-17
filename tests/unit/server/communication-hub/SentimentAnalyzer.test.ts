import { describe, it, expect } from 'vitest';
import { SentimentAnalyzer } from '../../../../server/communication-hub/sentiment/SentimentAnalyzer.js';

describe('SentimentAnalyzer', () => {
  it('detects negative sentiment', () => {
    expect(SentimentAnalyzer.analyze('Please stop emailing me, not interested')).toBe('negative');
  });

  it('detects positive sentiment', () => {
    expect(SentimentAnalyzer.analyze('Sounds good, thanks!')).toBe('positive');
  });

  it('defaults to neutral when no markers match', () => {
    expect(SentimentAnalyzer.analyze('Can you send the invoice again?')).toBe('neutral');
  });
});
