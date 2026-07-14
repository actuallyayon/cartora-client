export interface Notification {
  id: string;
  user: string;
  type: 'order' | 'promo' | 'system' | 'review' | 'account';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
