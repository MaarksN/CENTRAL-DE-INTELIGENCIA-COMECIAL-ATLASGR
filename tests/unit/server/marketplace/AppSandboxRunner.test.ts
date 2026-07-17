import { describe, it, expect, vi, afterEach } from 'vitest';
import { AppSandboxRunner } from '../../../../server/marketplace/sandbox/AppSandboxRunner.js';
import { eventBus } from '../../../../server/services/workflow/bus/MemoryEventBus.js';

describe('AppSandboxRunner', () => {
  afterEach(() => vi.restoreAllMocks());

  it('runs an app in the sandbox and publishes a completion event', async () => {
    const publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue('evt-1');

    const result = await AppSandboxRunner.run('app-slack-sync');

    expect(result.passed).toBe(true);
    expect(publishSpy).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'marketplace.app.sandbox_run_completed' }));
  });
});
