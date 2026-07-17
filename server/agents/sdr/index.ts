import { AgentSDK } from '../../agent-runtime/sdk/index.js';

AgentSDK.createAgent({
  id: 'sdr-agent',
  name: 'SDR Agent',
  description: 'Qualifica Leads e sugere abordagens iniciais.',
  version: '1.0.0',
  supportedTools: ['LeadTool', 'ActivityTool'],
  memoryType: 'session',
  permissions: ['read:lead', 'write:activity'],
  listensTo: ['LeadCreated'],
  publishesTo: ['LeadQualified']
});
