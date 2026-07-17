import { AgentSDK } from '../../agent-runtime/sdk/index.js';

AgentSDK.createAgent({
  id: 'revenue-director',
  name: 'Revenue Director Agent',
  description: 'Visão executiva e estratégica.',
  version: '1.0.0',
  supportedTools: ['LeadTool', 'ActivityTool'],
  memoryType: 'persistent',
  permissions: ['read:all'],
  listensTo: ['SystemTick'],
  publishesTo: ['StatusUpdated']
});
