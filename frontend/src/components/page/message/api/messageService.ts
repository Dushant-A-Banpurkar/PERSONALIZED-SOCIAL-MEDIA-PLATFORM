import axios from "axios";

// Fetch messages by conversationId
export const fetchMessages = async (conversationId: string) => {
  const response = await axios.get(`/api/message/${conversationId}`);
  return response.data;
};

// Send a new message
export const sendMessage = async (messageData: FormData) => {
  const response = await axios.post(`/api/message/create`, messageData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Get or create a conversation with a user
export const getOrCreateConversation = async (userId: string) => {
  const response = await axios.get(`/api/message/conversation/${userId}`);
  return response.data;
};
