import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  IconHeart,
  IconMessageCircle,
  IconUser,
} from '@tabler/icons-react';

interface Notification {
  _id: string;
  from: {
    username: string;
    profileimg?: string;
  };
  type: 'like' | 'comment' | 'follow';
  message: string;
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading, isError } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notification');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
  });

  // Delete notifications
  const { mutate: deleteNotifications, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notification', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete notifications');
      return res.json();
    },
    onSuccess: () => {
      toast.success('All notifications deleted successfully');
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error deleting notifications');
    },
  });

  // Map notification type to corresponding icon
  const renderIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <IconHeart className="w-6 h-6" />;
      case 'comment':
        return <IconMessageCircle className="w-6 h-6" />;
      case 'follow':
        return <IconUser className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 justify-center items-center mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Notifications</h1>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-end mb-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50"
            onClick={() => deleteNotifications()}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete All'}
          </button>
        </div>

        {/* Handle loading, error, and empty states */}
        {isLoading && <p>Loading notifications...</p>}
        {isError && <p className="text-red-500">Failed to load notifications.</p>}
        {notifications && notifications.length === 0 && (
          <p className="text-gray-500 text-center">No notifications yet!</p>
        )}

        {/* Render notifications */}
        {notifications &&
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="notification-item flex items-center border-b border-gray-200 py-4"
            >
              {/* Icon */}
              <div
                className={`icon p-2 rounded-full mr-4 ${
                  notification.type === 'like'
                    ? 'bg-blue-100 text-blue-500'
                    : notification.type === 'comment'
                    ? 'bg-green-100 text-green-500'
                    : 'bg-yellow-100 text-yellow-500'
                }`}
              >
                {renderIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-gray-800 font-semibold">
                  {notification.from.username}
                </p>
                <p className="text-gray-600">{notification.message}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NotificationPage;
