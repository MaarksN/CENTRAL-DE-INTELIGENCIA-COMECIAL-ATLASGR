type PartnerStage = 'application' | 'review' | 'sandbox_access' | 'certified';

type PartnerApplication = {
  id: string;
  companyName: string;
  stage: PartnerStage;
};

const STAGE_FLOW: readonly PartnerStage[] = ['application', 'review', 'sandbox_access', 'certified'];

export class PartnerOnboarding {
  static advance(application: PartnerApplication): PartnerApplication {
    const currentIndex = STAGE_FLOW.indexOf(application.stage);
    if (currentIndex === -1 || currentIndex === STAGE_FLOW.length - 1) {
      return application;
    }

    return {
      ...application,
      stage: STAGE_FLOW[currentIndex + 1],
    };
  }
}
