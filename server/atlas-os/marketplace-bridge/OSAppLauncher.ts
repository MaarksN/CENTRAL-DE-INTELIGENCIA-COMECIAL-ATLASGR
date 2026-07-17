import { AppCatalog } from '../../marketplace/catalog/AppCatalog.js';
import { ModuleKernel } from '../kernel/ModuleKernel.js';

export class OSAppLauncher {
  static launch(appId: string): { launched: boolean; appName?: string } {
    const app = AppCatalog.list().find((a) => a.id === appId);
    if (!app) return { launched: false };

    ModuleKernel.register({ id: app.id, name: app.name, version: '1.0.0', status: 'active' });
    return { launched: true, appName: app.name };
  }
}
