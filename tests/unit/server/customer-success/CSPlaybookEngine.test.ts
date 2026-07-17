import { describe, it, expect, vi, afterEach } from 'vitest';
import { CSPlaybookEngine } from '../../../../server/customer-success/playbooks/CSPlaybookEngine.js';
import { eventBus } from '../../../../server/services/workflow/bus/MemoryEventBus.js';

describe('CSPlaybookEngine', () => {
  afterEach(() => vi.restoreAllMocks());

  it('publishes a playbook event for an at-risk account', async () => {
    const publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue('evt-1');

    await CSPlaybookEngine.evaluateAccount('acc-1', 40);

    expect(publishSpy).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'customer_success.playbook.triggered' }));
  });

  it('does not publish anything for a healthy account', async () => {
    const publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue('evt-1');

    await CSPlaybookEngine.evaluateAccount('acc-2', 90);

    expect(publishSpy).not.toHaveBeenCalled();
  });
});
