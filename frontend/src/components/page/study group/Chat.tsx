import React, { useState, useEffect, useRef } from "react";

interface ChatProps {
  participants: { _id: string; username: string }[];
  currentUserId: string;
  sessionId: string;
}

interface Message {
  senderId: string;
  text: string;
  timestamp: string;
}

const Chat: React.FC<ChatProps> = ({ participants, currentUserId, sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch messages from the server
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send a new message to the server
  const sendMessage = async () => {
    if (newMessage.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      const message: Message = {
        senderId: currentUserId,
        text: newMessage,
        timestamp,
      };

      try {
        await fetch(`/api/sessions/${sessionId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });

        // Optimistically update the UI
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Scroll to the bottom of the chat whenever new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch messages when the component mounts or sessionId changes
  useEffect(() => {
    fetchMessages();
  }, [sessionId]);

  return (
    <div className="bg-gray-100 p-6 rounded-md max-w-md mx-auto shadow-lg">
      {/* Participants */}
      <div className="mb-4">
        <p className="font-semibold text-lg mb-2">Participants in Chat:</p>
        <ul className="list-disc list-inside text-gray-700 text-sm">
          {participants.map((participant) => (
            <li key={participant._id}>{participant.username}</li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="h-72 overflow-y-auto mb-4 p-4 bg-white rounded-md border border-gray-300 shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-3 rounded-md ${
              message.senderId === currentUserId
                ? "bg-blue-100 self-end"
                : "bg-gray-200"
            }`}
          >
            <p className="font-semibold text-sm">
              {participants.find((p) => p._id === message.senderId)?.username}{" "}
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </p>
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input and Send Button */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="border p-3 w-full rounded-md text-sm focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-5 py-3 rounded-md hover:bg-blue-600 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
