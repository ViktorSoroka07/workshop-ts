export type NotificationChannel = 'email' | 'sms' | 'push';

// Default export — this will NOT be forwarded by `export *` in the barrel:
export default function sendUrgent(message: string): void {
  console.log(`[URGENT] ${message}`);
}

export class NotificationService {
  send(channel: NotificationChannel, message: string): void {
    console.log(`[${channel.toUpperCase()}] ${message}`);
  }

  sendAll(message: string): void {
    const channels: NotificationChannel[] = ['email', 'sms', 'push'];
    channels.forEach((ch) => this.send(ch, message));
  }
}
