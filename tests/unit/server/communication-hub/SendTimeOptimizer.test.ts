import { describe, it, expect } from 'vitest';
import { SendTimeOptimizer } from '../../../../server/communication-hub/scheduling/SendTimeOptimizer.js';

describe('SendTimeOptimizer', () => {
  it('schedules for 9am local time later the same day when that slot has not passed', () => {
    const now = new Date('2026-07-17T06:00:00Z');
    const slot = SendTimeOptimizer.nextOptimalSlot(0, now);
    expect(slot.getHours()).toBe(9);
    expect(slot.getDate()).toBe(now.getDate());
  });

  it('rolls over to the next day when 9am has already passed', () => {
    const now = new Date('2026-07-17T15:00:00Z');
    const slot = SendTimeOptimizer.nextOptimalSlot(0, now);
    expect(slot.getDate()).toBe(now.getDate() + 1);
  });
});
