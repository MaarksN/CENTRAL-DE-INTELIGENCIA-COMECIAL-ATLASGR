import { ICondition } from '../types/ICondition.js';

export class ConditionRegistry {
  private static conditions = new Map<string, ICondition>();

  public static register(condition: ICondition) {
    this.conditions.set(condition.type, condition);
  }

  public static get(type: string): ICondition {
    const condition = this.conditions.get(type);
    if (!condition) {
      throw new Error(`Condition type ${type} is not registered`);
    }
    return condition;
  }
}
