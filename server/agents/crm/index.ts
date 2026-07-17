import { AgentSDK } from '../../agent-runtime/sdk/index.js';

AgentSDK.createAgent({
  id: 'crm-assistant',
  name: 'CRM Assistant Agent',
  description: 'Atualização e limpeza de dados do CRM.',
  version: '1.0.0',
  supportedTools: ['LeadTool', 'ActivityTool'],
  memoryType: 'persistent',
  permissions: ['read:all'],
  listensTo: ['SystemTick'],
  publishesTo: ['StatusUpdated']
});
