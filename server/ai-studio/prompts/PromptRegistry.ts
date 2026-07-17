export interface PromptTemplate {
  id: string;
  name: string;
  version: number;
  template: string;
}

export class PromptRegistry {
  private static templates: Map<string, PromptTemplate> = new Map([
    ['sdr-outreach', { id: 'sdr-outreach', name: 'SDR Outreach', version: 1, template: 'Write a cold email to {{contactName}} at {{company}}.' }],
    ['deal-summary', { id: 'deal-summary', name: 'Deal Summary', version: 1, template: 'Summarize the current state of deal {{dealId}}.' }],
  ]);

  static get(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  static register(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  static list(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }
}
