import { ExecutionContext } from '../execution/ExecutionContext.js';

export interface IAction {
  type: string;
  execute(context: ExecutionContext, payload: any): Promise<void>;
}
