export interface AgentManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  supportedTools: string[];
  memoryType: 'session' | 'persistent';
  permissions: string[];
  listensTo: string[];
  publishesTo: string[];
}
