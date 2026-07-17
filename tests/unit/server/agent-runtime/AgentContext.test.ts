import { describe, it, expect } from 'vitest';
import { AgentContext } from '../../../../server/agent-runtime/context/AgentContext.js';

describe('AgentContext', () => {
  it('seeds the internal map from constructor initial data', () => {
    const ctx = new AgentContext({ tenantId: 't1', accountId: 'a1' });
    expect(ctx.get('tenantId')).toBe('t1');
    expect(ctx.get('accountId')).toBe('a1');
  });

  it('supports get/set after construction', () => {
    const ctx = new AgentContext();
    ctx.set('foo', 'bar');
    expect(ctx.get('foo')).toBe('bar');
  });

  it('returns undefined for unknown keys', () => {
    const ctx = new AgentContext();
    expect(ctx.get('missing')).toBeUndefined();
  });

  it('getAll returns a plain object snapshot of the context', () => {
    const ctx = new AgentContext({ x: 1, y: 2 });
    expect(ctx.getAll()).toEqual({ x: 1, y: 2 });
  });
});
