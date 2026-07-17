import { eventBus } from '../../services/workflow/bus/MemoryEventBus.js';

export type CommunicationChannel = 'email' | 'sms' | 'whatsapp' | 'linkedin' | 'voice';

export interface OutboundMessage {
  channel: CommunicationChannel;
  to: string;
  body: string;
}

export class ChannelRouter {
  static async send(message: OutboundMessage): Promise<{ deliveryId: string; channel: CommunicationChannel }> {
    // Mock dispatch: in production this would call the relevant provider adapter per channel
    const deliveryId = crypto.randomUUID();

    await eventBus.publish({
      eventType: 'communication.message.sent',
      source: 'ChannelRouter',
      payload: { deliveryId, channel: message.channel, to: message.to },
    });

    return { deliveryId, channel: message.channel };
  }

  static preferredChannel(engagementHistory: CommunicationChannel[]): CommunicationChannel {
    return engagementHistory[0] ?? 'email';
  }
}
