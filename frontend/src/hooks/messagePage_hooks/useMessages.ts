import { useState, useEffect } from "react";
import axios from "axios";
import {create} from 'zustand';

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  recipient: string;
  message: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "audio" | "document" | null;
  createdAt: Date;
}

interface UseMessagesReturn {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  mediaFile: File | null;
  setMediaFile: (file: File | null) => void;
  handleSendMessage: () => Promise<void>;
}

export const useMessages = (
  conversationId: string,
  userId: string,
  conversationData: { sender: { _id: string }; receiver: { _id: string } }
): UseMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Fetch messages for the current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${conversationId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [conversationId]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !mediaFile) return;

    try {
      const formData = new FormData();
      formData.append("conversationId", conversationId);
      formData.append("sender", userId);
      formData.append(
        "receiver",
        userId === conversationData.sender._id
          ? conversationData.receiver._id
          : conversationData.sender._id
      );
      formData.append("message", newMessage);

      if (mediaFile) {
        formData.append("file", mediaFile);
      }

      const response = await axios.post("/api/messages/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the messages list with the newly sent message
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
      setMediaFile(null); // Clear the media file input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    mediaFile,
    setMediaFile,
    handleSendMessage,
  };
};
