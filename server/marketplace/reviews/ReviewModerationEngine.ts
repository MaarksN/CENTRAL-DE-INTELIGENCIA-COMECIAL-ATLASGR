export interface AppReview {
  appId: string;
  rating: number;
  comment: string;
}

export class ReviewModerationEngine {
  private static bannedTerms = ['scam', 'spam', 'fraud'];

  static moderate(review: AppReview): { approved: boolean; reason?: string } {
    if (review.rating < 1 || review.rating > 5) {
      return { approved: false, reason: 'Rating out of range' };
    }

    const lower = review.comment.toLowerCase();
    const flagged = this.bannedTerms.find((term) => lower.includes(term));
    if (flagged) {
      return { approved: false, reason: `Contains banned term: ${flagged}` };
    }

    return { approved: true };
  }
}
