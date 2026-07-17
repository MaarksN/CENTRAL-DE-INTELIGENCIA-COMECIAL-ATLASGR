import { AgentSDK } from '../../agent-runtime/sdk/index.js';

AgentSDK.createAgent({
  id: 'research-agent',
  name: 'Research Agent',
  description: 'Análise de empresas e contexto de mercado.',
  version: '1.0.0',
  supportedTools: ['LeadTool', 'ActivityTool'],
  memoryType: 'persistent',
  permissions: ['read:all'],
  listensTo: ['SystemTick'],
  publishesTo: ['StatusUpdated']
});
