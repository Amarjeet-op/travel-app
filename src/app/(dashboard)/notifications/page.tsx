'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, CheckCircle2, MessageSquare, AlertCircle, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH', body: JSON.stringify({}) });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success('All marked as read');
      }
    } catch (e) { toast.error('Failed to update'); }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', { 
        method: 'PATCH', 
        body: JSON.stringify({ notificationId: id }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (e) { console.error(e); }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'mention': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'trip_request': return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'trip_update': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'alert': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        {notifications.some(n => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse bg-muted rounded-xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
          <p className="text-muted-foreground">You have no new notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`p-4 transition-all duration-300 hover:shadow-md cursor-pointer border-l-4 ${
                notification.read ? 'border-l-transparent bg-card/50' : 'border-l-primary bg-primary/5'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex gap-4">
                <div className="mt-1 shadow-sm rounded-full p-2 bg-background">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold ${notification.read ? 'text-foreground/80' : 'text-foreground'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {notification.createdAt?.seconds ? format(new Date(notification.createdAt.seconds * 1000), 'MMM dd, HH:mm') : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    {notification.message}
                  </p>
                  {notification.conversationId ? (
                    <Link href={`/messages/${notification.conversationId}`}>
                      <Button variant="secondary" size="sm" className="h-8 text-xs font-bold gap-2 hover:bg-primary hover:text-white transition-all">
                        View Message <ArrowLeft className="h-3 w-3 rotate-180" />
                      </Button>
                    </Link>
                  ) : notification.tripId ? (
                    <Link href={`/trips/my-trips?tab=pending`}>
                      <Button variant="secondary" size="sm" className="h-8 text-xs font-bold gap-2 hover:bg-primary hover:text-white transition-all">
                        View Trip Request <ArrowLeft className="h-3 w-3 rotate-180" />
                      </Button>
                    </Link>
                  ) : null}
                </div>
                {!notification.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse mt-2 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
