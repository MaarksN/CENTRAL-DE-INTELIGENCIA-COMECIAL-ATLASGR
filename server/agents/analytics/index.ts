import { AgentSDK } from '../../agent-runtime/sdk/index.js';

AgentSDK.createAgent({
  id: 'analytics-agent',
  name: 'Analytics Agent',
  description: 'Observação de tendências e relatórios.',
  version: '1.0.0',
  supportedTools: ['LeadTool', 'ActivityTool'],
  memoryType: 'persistent',
  permissions: ['read:all'],
  listensTo: ['SystemTick'],
  publishesTo: ['StatusUpdated']
});
