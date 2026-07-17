import { describe, it, expect } from 'vitest';
import { PlaybookEngine } from '../../../../server/revenue-system/playbooks/PlaybookEngine.js';

describe('PlaybookEngine', () => {
  it('returns at least one eligible playbook for a tenant', async () => {
    const playbooks = await PlaybookEngine.getEligiblePlaybooks('tenant-1');
    expect(playbooks.length).toBeGreaterThan(0);
    expect(playbooks[0]).toHaveProperty('trigger');
  });
});
