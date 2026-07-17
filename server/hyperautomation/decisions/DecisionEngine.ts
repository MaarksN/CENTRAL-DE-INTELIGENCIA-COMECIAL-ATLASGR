export interface DecisionRule {
  condition: (facts: Record<string, number>) => boolean;
  outcome: string;
}

export class DecisionEngine {
  static evaluate(facts: Record<string, number>, rules: DecisionRule[]): string {
    const matched = rules.find((rule) => rule.condition(facts));
    return matched?.outcome ?? 'no_action';
  }
}
