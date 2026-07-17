export const PartnerOnboarding = {
  advance: (app: any) => {
    switch (app.stage) {
      case 'application':
        return { ...app, stage: 'review' };
      case 'review':
        return { ...app, stage: 'sandbox_access' };
      case 'sandbox_access':
        return { ...app, stage: 'certified' };
      case 'certified':
        return app;
      default:
        return app;
    }
  }
};
