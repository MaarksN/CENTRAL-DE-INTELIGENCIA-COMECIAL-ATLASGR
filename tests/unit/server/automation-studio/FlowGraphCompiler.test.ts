import { describe, it, expect } from 'vitest';
import { FlowGraphCompiler } from '../../../../server/automation-studio/canvas/FlowGraphCompiler.js';

describe('FlowGraphCompiler', () => {
  it('throws when a flow has no trigger node', () => {
    expect(() => FlowGraphCompiler.compile('wf-1', [{ id: 'a1', kind: 'action', refType: 'send_email', next: [] }])).toThrow(
      /at least one trigger/,
    );
  });

  it('orders steps trigger -> condition -> action', () => {
    const compiled = FlowGraphCompiler.compile('wf-1', [
      { id: 'a1', kind: 'action', refType: 'send_email', next: [] },
      { id: 'c1', kind: 'condition', refType: 'deal_stage', next: ['a1'] },
      { id: 't1', kind: 'trigger', refType: 'lead.created', next: ['c1'] },
    ]);

    expect(compiled.steps.map((s) => s.kind)).toEqual(['trigger', 'condition', 'action']);
  });
});
