import { describe, it, expect } from 'vitest';
import { TriggerCatalog } from '../../../../server/automation-studio/triggers/TriggerCatalog.js';

describe('TriggerCatalog', () => {
  it('lists all trigger types when no category filter is given', () => {
    expect(TriggerCatalog.list().length).toBeGreaterThanOrEqual(5);
  });

  it('filters trigger types by category', () => {
    const crmTriggers = TriggerCatalog.list('crm');
    expect(crmTriggers.every((t) => t.category === 'crm')).toBe(true);
    expect(crmTriggers.length).toBeGreaterThan(0);
  });
});
