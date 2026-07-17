import { describe, it, expect } from 'vitest';
import { AppCatalog } from '../../../../server/marketplace/catalog/AppCatalog.js';

describe('AppCatalog', () => {
  it('lists the seeded marketplace apps', () => {
    expect(AppCatalog.list().length).toBeGreaterThanOrEqual(3);
  });

  it('filters apps by category', () => {
    const agentApps = AppCatalog.list('agent');
    expect(agentApps.every((a) => a.category === 'agent')).toBe(true);
  });

  it('publish() adds a new app to the catalog', () => {
    AppCatalog.publish({ id: 'app-test-1', name: 'Test App', publisher: 'Test Co', category: 'analytics', installs: 0 });
    expect(AppCatalog.list().some((a) => a.id === 'app-test-1')).toBe(true);
  });
});
