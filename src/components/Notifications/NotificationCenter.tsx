import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, BellOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const { data: notifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);
      return data;
    },
    enabled: !!user?.id
  });

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="relative"
        icon={notifications?.some(n => !n.read) ? <Bell className="text-brand-600" /> : <BellOff />}
      >
        {notifications?.some(n => !n.read) && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </Button>

      <div className="absolute right-0 mt-2 w-80 z-50">
        <Card>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma notificação
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications?.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};