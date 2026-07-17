import { describe, it, expect } from 'vitest';
import { ProcessMiningEngine } from '../../../../server/hyperautomation/discovery/ProcessMiningEngine.js';

describe('ProcessMiningEngine', () => {
  it('discovers a single ordered path for a case with sequential events', () => {
    const discovered = ProcessMiningEngine.discover([
      { caseId: 'c1', activity: 'submit', timestamp: new Date('2026-01-01T00:00:00Z') },
      { caseId: 'c1', activity: 'approve', timestamp: new Date('2026-01-01T01:00:00Z') },
    ]);

    expect(discovered).toEqual([{ path: ['submit', 'approve'], frequency: 1 }]);
  });

  it('aggregates identical paths across multiple cases into one frequency count', () => {
    const discovered = ProcessMiningEngine.discover([
      { caseId: 'c1', activity: 'submit', timestamp: new Date('2026-01-01T00:00:00Z') },
      { caseId: 'c1', activity: 'approve', timestamp: new Date('2026-01-01T01:00:00Z') },
      { caseId: 'c2', activity: 'submit', timestamp: new Date('2026-01-02T00:00:00Z') },
      { caseId: 'c2', activity: 'approve', timestamp: new Date('2026-01-02T01:00:00Z') },
    ]);

    expect(discovered).toEqual([{ path: ['submit', 'approve'], frequency: 2 }]);
  });
});
