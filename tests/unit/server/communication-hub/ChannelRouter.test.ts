import { describe, it, expect, vi, afterEach } from 'vitest';
import { ChannelRouter } from '../../../../server/communication-hub/channels/ChannelRouter.js';
import { eventBus } from '../../../../server/services/workflow/bus/MemoryEventBus.js';

describe('ChannelRouter', () => {
  afterEach(() => vi.restoreAllMocks());

  it('send() returns a delivery id for the requested channel and publishes an event', async () => {
    const publishSpy = vi.spyOn(eventBus, 'publish').mockResolvedValue('evt-1');

    const result = await ChannelRouter.send({ channel: 'whatsapp', to: '+5511999999999', body: 'hi' });

    expect(result.channel).toBe('whatsapp');
    expect(result.deliveryId).toBeTruthy();
    expect(publishSpy).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'communication.message.sent' }));
  });

  it('preferredChannel() falls back to email with no engagement history', () => {
    expect(ChannelRouter.preferredChannel([])).toBe('email');
  });

  it('preferredChannel() picks the most recent engaged channel', () => {
    expect(ChannelRouter.preferredChannel(['sms', 'email'])).toBe('sms');
  });
});
