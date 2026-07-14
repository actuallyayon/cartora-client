'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Check, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/features/notification/use-notification';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('All notifications marked as read.');
      },
    });
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    markAsReadMutation.mutate(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative hover:bg-accent rounded-full"
        aria-label="Toggle notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-lg border border-border bg-card text-card-foreground shadow-lg focus:outline-none z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/40">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="text-primary hover:text-primary/80 text-xs font-medium disabled:opacity-40"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="py-8 flex justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (!n.isRead) markAsReadMutation.mutate(n.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'p-4 transition-colors flex gap-3 text-xs items-start cursor-pointer hover:bg-muted/15',
                    !n.isRead && 'bg-primary/5'
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {n.type === 'order' ? (
                      <AlertCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className={cn('text-foreground font-medium', !n.isRead && 'font-semibold')}>
                      {n.title}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {n.message}
                    </p>

                  </div>
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(e, n.id)}
                      disabled={markAsReadMutation.isPending}
                      className="shrink-0 p-1 text-muted-foreground hover:text-primary rounded hover:bg-primary/10 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
