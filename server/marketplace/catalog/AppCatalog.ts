export interface MarketplaceApp {
  id: string;
  name: string;
  publisher: string;
  category: 'integration' | 'analytics' | 'automation' | 'agent';
  installs: number;
}

export class AppCatalog {
  private static apps: MarketplaceApp[] = [
    { id: 'app-slack-sync', name: 'Slack Sync', publisher: 'Atlas Labs', category: 'integration', installs: 412 },
    { id: 'app-forecast-plus', name: 'Forecast+', publisher: 'Partner Co', category: 'analytics', installs: 187 },
    { id: 'app-sdr-agent-pack', name: 'SDR Agent Pack', publisher: 'Atlas Labs', category: 'agent', installs: 305 },
  ];

  static list(category?: MarketplaceApp['category']): MarketplaceApp[] {
    return category ? this.apps.filter((a) => a.category === category) : this.apps;
  }

  static publish(app: MarketplaceApp): void {
    this.apps.push(app);
  }
}
