import { describe, it, expect } from 'vitest';
import { FlowVersionControl } from '../../../../server/automation-studio/versioning/FlowVersionControl.js';
import { FlowGraphCompiler } from '../../../../server/automation-studio/canvas/FlowGraphCompiler.js';

describe('FlowVersionControl', () => {
  it('starts a new workflow at version 1 and increments on each snapshot', () => {
    const flow = FlowGraphCompiler.compile('wf-versioned', [{ id: 't1', kind: 'trigger', refType: 'lead.created', next: [] }]);

    const v1 = FlowVersionControl.snapshot(flow);
    const v2 = FlowVersionControl.snapshot(flow);

    expect(v1.version).toBe(1);
    expect(v2.version).toBe(2);
    expect(FlowVersionControl.getHistory('wf-versioned')).toHaveLength(2);
  });

  it('returns an empty history for a workflow with no snapshots', () => {
    expect(FlowVersionControl.getHistory('never-snapshotted')).toEqual([]);
  });
});
