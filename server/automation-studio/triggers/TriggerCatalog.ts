export interface TriggerCatalogEntry {
  type: string;
  label: string;
  category: 'crm' | 'communication' | 'schedule' | 'agent';
}

export class TriggerCatalog {
  private static entries: TriggerCatalogEntry[] = [
    { type: 'deal.stage_changed', label: 'Deal Stage Changed', category: 'crm' },
    { type: 'lead.created', label: 'Lead Created', category: 'crm' },
    { type: 'message.received', label: 'Message Received', category: 'communication' },
    { type: 'schedule.cron', label: 'Scheduled Time', category: 'schedule' },
    { type: 'agent.task_completed', label: 'Agent Task Completed', category: 'agent' },
  ];

  static list(category?: TriggerCatalogEntry['category']): TriggerCatalogEntry[] {
    return category ? this.entries.filter((e) => e.category === category) : this.entries;
  }
}
