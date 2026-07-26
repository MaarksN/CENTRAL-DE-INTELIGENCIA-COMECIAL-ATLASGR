const stageOrder = ['application', 'review', 'sandbox_access', 'certified'];

export const PartnerOnboarding = {
  advance(application) {
    const currentIndex = stageOrder.indexOf(application.stage);
    if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) {
      return application;
    }

    return {
      ...application,
      stage: stageOrder[currentIndex + 1],
    };
  },
};
