import { ITool } from '../tools/Tool.js';

export class ToolRegistry {
  private static tools: Map<string, ITool> = new Map();

  static register(tool: ITool): void {
    const name = tool.manifest.name;
    if (this.tools.has(name)) {
      throw new Error(`Tool ${name} is already registered.`);
    }
    this.tools.set(name, tool);
    console.log(`[ToolRegistry] Registered Tool: ${name}`);
  }

  static get(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  static getAll(): ITool[] {
    return Array.from(this.tools.values());
  }
}
