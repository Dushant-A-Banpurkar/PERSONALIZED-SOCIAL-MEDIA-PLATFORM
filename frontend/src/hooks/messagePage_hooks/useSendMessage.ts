// hooks/messagePage_hooks/useSendMessage.ts
import { useState } from 'react';

interface SendMessageParams {
  conversationId?: string;
  sender: string;
  receiver: string;
  message: string;
  file?: File | null;
}

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async ({ conversationId, sender, receiver, message, file }: SendMessageParams) => {
    setLoading(true);

    const formData = new FormData();
    if (conversationId) formData.append('conversationId', conversationId);
    formData.append('senderId', sender);
    formData.append('receiverId', receiver);
    if (message) formData.append('message', message);
    if (file) formData.append('file', file);

    try {
      const response = await fetch('/api/messages/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
