import { describe, it, expect } from 'vitest';
import { ServiceRegistry } from '../../../../server/atlas-os/registry/ServiceRegistry.js';

describe('ServiceRegistry', () => {
  it('registers all five core platform domains', () => {
    const domains = ServiceRegistry.all().map((s) => s.domain);
    expect(domains).toEqual(expect.arrayContaining(['crm', 'workflow', 'agent-runtime', 'revenue-ai-os', 'knowledge']));
  });

  it('byDomain() resolves a service descriptor for a known domain', () => {
    expect(ServiceRegistry.byDomain('workflow')?.name).toBe('Workflow Engine');
  });

  it('byDomain() returns undefined for an unregistered domain', () => {
    expect(ServiceRegistry.byDomain('platform')).toBeUndefined();
  });
});
