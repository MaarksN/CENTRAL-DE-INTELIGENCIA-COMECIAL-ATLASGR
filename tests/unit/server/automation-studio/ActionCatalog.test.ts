import { describe, it, expect } from 'vitest';
import { ActionCatalog } from '../../../../server/automation-studio/actions/ActionCatalog.js';
import { ActionRegistry } from '../../../../server/services/workflow/registry/ActionRegistry.js';

describe('ActionCatalog', () => {
  it('marks actions as unregistered when the workflow registry has no matching entry', () => {
    const entries = ActionCatalog.list();
    expect(entries.find((e) => e.type === 'send_email')?.registered).toBe(false);
  });

  it('marks an action as registered once it is added to the workflow ActionRegistry', () => {
    ActionRegistry.register({ type: 'send_email', execute: async () => undefined } as never);
    const entries = ActionCatalog.list();
    expect(entries.find((e) => e.type === 'send_email')?.registered).toBe(true);
  });
});
