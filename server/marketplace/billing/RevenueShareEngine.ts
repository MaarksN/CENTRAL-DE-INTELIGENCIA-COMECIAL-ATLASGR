export interface RevenueShareResult {
  grossAmount: number;
  platformFee: number;
  partnerPayout: number;
}

export class RevenueShareEngine {
  private static readonly PLATFORM_FEE_RATE = 0.2;

  static calculate(grossAmount: number): RevenueShareResult {
    const platformFee = Math.round(grossAmount * this.PLATFORM_FEE_RATE * 100) / 100;
    return { grossAmount, platformFee, partnerPayout: grossAmount - platformFee };
  }
}
