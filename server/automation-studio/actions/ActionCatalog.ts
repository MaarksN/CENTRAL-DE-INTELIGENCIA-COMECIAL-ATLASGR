import { ActionRegistry } from '../../services/workflow/registry/ActionRegistry.js';

export interface ActionCatalogEntry {
  type: string;
  label: string;
  registered: boolean;
}

export class ActionCatalog {
  private static knownActions: string[] = ['send_email', 'create_task', 'update_field', 'notify_slack', 'run_agent'];

  static list(): ActionCatalogEntry[] {
    return this.knownActions.map((type) => {
      let registered = true;
      try {
        ActionRegistry.get(type);
      } catch {
        registered = false;
      }
      return { type, label: type.replace(/_/g, ' '), registered };
    });
  }
}
