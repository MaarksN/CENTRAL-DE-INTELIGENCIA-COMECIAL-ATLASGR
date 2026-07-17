export interface ToolManifest {
  name: string;
  description: string;
  version: string;
  parametersSchema: any; // e.g. JSON Schema or Zod
}

export interface ITool {
  manifest: ToolManifest;
  execute(params: any, context: any): Promise<any>;
}
