import { describe, it, expect } from 'vitest';
import { RPABotManager } from '../../../../server/hyperautomation/rpa/RPABotManager.js';

describe('RPABotManager', () => {
  it('lists the seeded bots as idle by default', () => {
    const bots = RPABotManager.list();
    expect(bots.length).toBeGreaterThanOrEqual(2);
  });

  it('trigger() moves a bot into the running state', () => {
    const bot = RPABotManager.trigger('bot-invoice-entry');
    expect(bot.status).toBe('running');
  });

  it('trigger() throws for an unknown bot id', () => {
    expect(() => RPABotManager.trigger('bot-does-not-exist')).toThrow(/not found/);
  });
});
