import { ExecutionContext } from '../execution/ExecutionContext.js';

export interface ICondition {
  type: string;
  evaluate(context: ExecutionContext, value: string): boolean;
}
