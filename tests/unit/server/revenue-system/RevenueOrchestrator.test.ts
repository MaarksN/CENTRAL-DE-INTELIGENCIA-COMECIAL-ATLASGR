import { describe, it, expect, vi, afterEach } from 'vitest';
import { RevenueOrchestrator } from '../../../../server/revenue-system/orchestrator/RevenueOrchestrator.js';
import { eventBus } from '../../../../server/services/workflow/bus/MemoryEventBus.js';

describe('RevenueOrchestrator', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('publishes one event per eligible playbook and reports the count', async () => {
    const publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue('mock-event-id');

    const result = await RevenueOrchestrator.runCycle('tenant-1');

    expect(result.actionsTriggered).toBeGreaterThan(0);
    expect(publishSpy).toHaveBeenCalledTimes(result.actionsTriggered);
    expect(publishSpy).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'revenue.playbook.triggered', source: 'RevenueOrchestrator' }),
    );
  });
});
