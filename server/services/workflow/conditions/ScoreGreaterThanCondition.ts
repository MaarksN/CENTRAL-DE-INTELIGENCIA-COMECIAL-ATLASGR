import { ICondition } from '../types/ICondition.js';
import { ExecutionContext } from '../execution/ExecutionContext.js';

export class ScoreGreaterThanCondition implements ICondition {
  public type = 'ScoreGreaterThan';

  evaluate(context: ExecutionContext, value: string): boolean {
    if (context.lead && context.lead.icpScore !== undefined) {
      return context.lead.icpScore > parseInt(value, 10);
    }
    return false;
  }
}
