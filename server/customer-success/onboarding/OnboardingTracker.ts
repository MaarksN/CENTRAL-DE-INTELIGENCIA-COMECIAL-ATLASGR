export interface OnboardingMilestone {
  key: string;
  label: string;
  completed: boolean;
}

export class OnboardingTracker {
  static getMilestones(_accountId: string): OnboardingMilestone[] {
    return [
      { key: 'kickoff_call', label: 'Kickoff Call Completed', completed: true },
      { key: 'data_import', label: 'Data Imported', completed: true },
      { key: 'first_workflow', label: 'First Automation Published', completed: false },
      { key: 'team_invited', label: 'Team Members Invited', completed: false },
    ];
  }

  static completionRate(milestones: OnboardingMilestone[]): number {
    if (milestones.length === 0) return 0;
    return Math.round((milestones.filter((m) => m.completed).length / milestones.length) * 100);
  }
}
