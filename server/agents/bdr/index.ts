import { AgentSDK } from '../../agent-runtime/sdk/index.js';

AgentSDK.createAgent({
  id: 'bdr-agent',
  name: 'BDR Agent',
  description: 'Prospecção e descoberta de oportunidades (Outbound).',
  version: '1.0.0',
  supportedTools: ['LeadTool', 'ActivityTool', 'CompanyTool'],
  memoryType: 'session',
  permissions: ['read:lead', 'read:company', 'write:activity'],
  listensTo: ['LeadQualified'],
  publishesTo: ['OpportunityDiscovered']
});
