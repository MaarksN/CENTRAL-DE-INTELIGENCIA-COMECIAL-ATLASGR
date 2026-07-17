export type PartnerOnboardingStage = 'application' | 'review' | 'sandbox_access' | 'certified';

export interface PartnerApplication {
  id: string;
  companyName: string;
  stage: PartnerOnboardingStage;
}

export class PartnerOnboarding {
  private static readonly STAGES: PartnerOnboardingStage[] = ['application', 'review', 'sandbox_access', 'certified'];

  static advance(application: PartnerApplication): PartnerApplication {
    const currentIndex = this.STAGES.indexOf(application.stage);
    const nextStage = this.STAGES[Math.min(currentIndex + 1, this.STAGES.length - 1)];
    return { ...application, stage: nextStage };
  }
}
