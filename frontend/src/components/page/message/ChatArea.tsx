import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import io from "socket.io-client"; // Import Socket.IO client

interface User {
  _id: string;
  profileimg: string;
  firstname: string;
  lastname: string;
  username: string;
}

interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: User[];
  createdAt: string;
}

interface ChatAreaProps {
  conversation: Conversation;
}

const socket = io("http://localhost:5001"); // Connect to backend WebSocket server

const ChatArea: React.FC<ChatAreaProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  // Fetch authenticated user data
  const { data: authUser, isLoading: isAuthUserLoading } = useQuery<User>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/me");
      return response.data;
    },
  });

  // Fetch messages for the current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${conversation._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    console.log(conversation._id);

    if (conversation._id) {
      fetchMessages();
    }
  }, [conversation]);

  // Set up socket listener to receive real-time messages
  useEffect(() => {
    if (authUser?._id) {
      socket.emit("join", authUser._id); // Join the user's room for real-time updates

      const handleNewMessage = (message: Message) => {
        if (message.recipientId === authUser._id || message.senderId === authUser._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      socket.on("new_message", (message: Message) => {
        if (message.recipientId === authUser._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      
      return () => {
        socket.off("new_message", handleNewMessage); // Cleanup socket listener on unmount
      };
    }
  }, [authUser]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!authUser?._id) {
      console.error("User not authenticated!");
      return;
    }

    try {
      const recipient = conversation.participants.find(
        (participant) => participant._id !== authUser._id
      );

      if (!recipient) {
        console.error("Recipient not found!");
        return;
      }

      const response = await axios.post(`/api/messages/send/${recipient?._id}`, {
        text: newMessage, // Only text, no file
        receiverId: recipient?._id,
      });
      // Emit the new message via socket
      socket.emit("new_message", response.data);

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(
    (participant) => participant._id !== authUser?._id
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center">
        {/* Display other participant's profile image */}
        <img
          src={otherParticipant?.profileimg || "/default-profile.png"}
          alt="profile"
          className="w-10 h-10 rounded-full mr-2"
        />
        <h2 className="text-xl font-semibold">
          {isAuthUserLoading
            ? "Loading..."
            : otherParticipant
            ? `${otherParticipant.firstname} ${otherParticipant.lastname}`
            : "User not found"}
        </h2>
      </div>

      {/* Messages */}
      <div className="bg-gray-100 p-4 rounded-lg h-[calc(100vh-200px)] overflow-y-scroll">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 ${
                message.senderId === authUser?._id ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.senderId === authUser?._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs text-gray-400">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet</p>
        )}
      </div>

      {/* Message Input */}
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 rounded-lg border border-gray-300"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
