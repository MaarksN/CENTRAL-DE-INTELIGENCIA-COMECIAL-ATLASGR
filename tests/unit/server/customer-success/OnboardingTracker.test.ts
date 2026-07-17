import { describe, it, expect } from 'vitest';
import { OnboardingTracker } from '../../../../server/customer-success/onboarding/OnboardingTracker.js';

describe('OnboardingTracker', () => {
  it('computes completion rate from milestone list', () => {
    const milestones = OnboardingTracker.getMilestones('acc-1');
    const rate = OnboardingTracker.completionRate(milestones);
    expect(rate).toBe(50);
  });

  it('completionRate handles an empty milestone list without dividing by zero', () => {
    expect(OnboardingTracker.completionRate([])).toBe(0);
  });
});
