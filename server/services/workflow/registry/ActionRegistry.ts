import { IAction } from '../types/IAction.js';

export class ActionRegistry {
  private static actions = new Map<string, IAction>();

  public static register(action: IAction) {
    this.actions.set(action.type, action);
  }

  public static get(type: string): IAction {
    const action = this.actions.get(type);
    if (!action) {
      throw new Error(`Action type ${type} is not registered`);
    }
    return action;
  }

  public static getAll(): IAction[] {
    return Array.from(this.actions.values());
  }
}
