export interface ServiceDescriptor {
  name: string;
  domain: 'crm' | 'workflow' | 'agent-runtime' | 'revenue-ai-os' | 'knowledge' | 'platform';
  healthy: boolean;
}

export class ServiceRegistry {
  private static readonly services: ServiceDescriptor[] = [
    { name: 'CRM Core', domain: 'crm', healthy: true },
    { name: 'Workflow Engine', domain: 'workflow', healthy: true },
    { name: 'Agent Runtime', domain: 'agent-runtime', healthy: true },
    { name: 'Revenue AI OS', domain: 'revenue-ai-os', healthy: true },
    { name: 'Knowledge Platform', domain: 'knowledge', healthy: true },
  ];

  static all(): ServiceDescriptor[] {
    return this.services;
  }

  static byDomain(domain: ServiceDescriptor['domain']): ServiceDescriptor | undefined {
    return this.services.find((s) => s.domain === domain);
  }
}
