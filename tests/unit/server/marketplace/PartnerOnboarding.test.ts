import { describe, it, expect } from 'vitest';
import { PartnerOnboarding } from '../../../../server/marketplace/partners/PartnerOnboarding.js';

describe('PartnerOnboarding', () => {
  it('advances a partner through each onboarding stage in order', () => {
    let app: any = { id: 'p1', companyName: 'Acme', stage: 'application' };
    app = PartnerOnboarding.advance(app);
    expect(app.stage).toBe('review');
    app = PartnerOnboarding.advance(app);
    expect(app.stage).toBe('sandbox_access');
    app = PartnerOnboarding.advance(app);
    expect(app.stage).toBe('certified');
  });

  it('stays at certified once fully advanced', () => {
    const app = PartnerOnboarding.advance({ id: 'p1', companyName: 'Acme', stage: 'certified' });
    expect(app.stage).toBe('certified');
  });
});
