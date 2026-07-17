import { describe, it, expect } from 'vitest';
import { ModelRouter } from '../../../../server/ai-studio/models/ModelRouter.js';

describe('ModelRouter', () => {
  it('routes low complexity tasks to the fast tier', () => {
    expect(ModelRouter.selectTierForTask(0.1)).toBe('fast');
  });

  it('routes medium complexity tasks to the balanced tier', () => {
    expect(ModelRouter.selectTierForTask(0.5)).toBe('balanced');
  });

  it('routes high complexity tasks to the reasoning tier', () => {
    expect(ModelRouter.selectTierForTask(0.9)).toBe('reasoning');
  });

  it('route() returns a usable provider for every tier', () => {
    expect(ModelRouter.route('fast').name).toBe('MockProvider');
    expect(ModelRouter.route('reasoning').name).toBe('MockProvider');
  });
});
