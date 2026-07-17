export type BotStatus = 'idle' | 'running' | 'error';

export interface RPABot {
  id: string;
  name: string;
  status: BotStatus;
}

export class RPABotManager {
  private static bots: Map<string, RPABot> = new Map([
    ['bot-invoice-entry', { id: 'bot-invoice-entry', name: 'Invoice Data Entry', status: 'idle' }],
    ['bot-crm-cleanup', { id: 'bot-crm-cleanup', name: 'CRM Field Cleanup', status: 'idle' }],
  ]);

  static list(): RPABot[] {
    return Array.from(this.bots.values());
  }

  static trigger(botId: string): RPABot {
    const bot = this.bots.get(botId);
    if (!bot) throw new Error(`Bot ${botId} not found.`);
    bot.status = 'running';
    return bot;
  }
}
