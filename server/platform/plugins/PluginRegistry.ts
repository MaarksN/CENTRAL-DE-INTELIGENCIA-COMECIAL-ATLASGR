export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
}

export interface IPlugin {
  manifest: PluginManifest;
  onInstall(): Promise<void>;
  onEnable(): Promise<void>;
  onDisable(): Promise<void>;
}

export class PluginRegistry {
  private static plugins = new Map<string, IPlugin>();

  static register(plugin: IPlugin): void {
    if (this.plugins.has(plugin.manifest.id)) {
      throw new Error(`Plugin ${plugin.manifest.id} is already registered.`);
    }
    this.plugins.set(plugin.manifest.id, plugin);
  }

  static getPlugin(id: string): IPlugin | undefined {
    return this.plugins.get(id);
  }

  static listPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values()).map(p => p.manifest);
  }
}
