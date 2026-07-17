import { describe, it, expect } from 'vitest';
import { ReviewModerationEngine } from '../../../../server/marketplace/reviews/ReviewModerationEngine.js';

describe('ReviewModerationEngine', () => {
  it('rejects ratings outside the 1-5 range', () => {
    expect(ReviewModerationEngine.moderate({ appId: 'a1', rating: 6, comment: 'great' }).approved).toBe(false);
  });

  it('rejects reviews containing banned terms', () => {
    const result = ReviewModerationEngine.moderate({ appId: 'a1', rating: 1, comment: 'this app is a scam' });
    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/scam/);
  });

  it('approves well-formed, clean reviews', () => {
    expect(ReviewModerationEngine.moderate({ appId: 'a1', rating: 5, comment: 'love it' }).approved).toBe(true);
  });
});
