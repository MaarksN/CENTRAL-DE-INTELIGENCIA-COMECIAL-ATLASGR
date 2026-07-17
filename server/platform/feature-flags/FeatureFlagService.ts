export class FeatureFlagService {
  private static flags: Record<string, boolean> = {
    'new_dashboard': true,
    'beta_agent_director': false,
    'ai_auto_email': false
  };

  static isEnabled(flagName: string, tenantId?: string): boolean {
    // In an enterprise system, this checks tenant overrides.
    // For now, returning global defaults.
    return this.flags[flagName] || false;
  }

  static enable(flagName: string): void {
    this.flags[flagName] = true;
  }

  static disable(flagName: string): void {
    this.flags[flagName] = false;
  }
}
