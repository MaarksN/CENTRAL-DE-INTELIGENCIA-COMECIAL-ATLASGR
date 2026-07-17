import { describe, it, expect, vi, afterEach } from 'vitest';
import { FlowRuntime } from '../../../../server/automation-studio/runtime/FlowRuntime.js';
import { eventBus } from '../../../../server/services/workflow/bus/MemoryEventBus.js';

describe('FlowRuntime', () => {
  afterEach(() => vi.restoreAllMocks());

  it('publishes a test-run event describing the compiled flow', async () => {
    const publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue('evt-1');

    const id = await FlowRuntime.publishTestRun({ workflowId: 'wf-1', steps: [{ id: 't1', kind: 'trigger', refType: 'x', next: [] }] });

    expect(id).toBe('evt-1');
    expect(publishSpy).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'automation_studio.flow.test_run', payload: { workflowId: 'wf-1', stepCount: 1 } }),
    );
  });
});
