import { CommunicationChannel } from '../channels/ChannelRouter.js';

export interface InboxThread {
  id: string;
  channel: CommunicationChannel;
  contactId: string;
  lastMessageAt: Date;
  unread: boolean;
}

export class UnifiedInbox {
  static async getThreads(_tenantId: string): Promise<InboxThread[]> {
    return [
      { id: 'thr-1', channel: 'email', contactId: 'contact-1', lastMessageAt: new Date(), unread: true },
      { id: 'thr-2', channel: 'whatsapp', contactId: 'contact-2', lastMessageAt: new Date(), unread: false },
    ];
  }
}
