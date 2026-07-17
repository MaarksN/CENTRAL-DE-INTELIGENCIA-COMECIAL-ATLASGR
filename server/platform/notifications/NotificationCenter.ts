export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  channels: ('email' | 'push' | 'in_app' | 'slack')[];
}

export class NotificationCenter {
  static async send(notification: NotificationPayload): Promise<void> {
    // Platform abstraction for sending notifications
    console.log(`[NotificationCenter] Routing notification to ${notification.userId} via ${notification.channels.join(', ')}`);
  }
}
