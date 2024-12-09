import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import ChatArea from "./ChatArea";

interface User {
  _id: string;
  profileimg: string;
  firstname: string;
  lastname: string;
  username: string;
}

interface Conversation {
  _id: string;
  participants: User[];
  text: string;
  createdAt: string; // ISO date string
}

const fetchFollowingUsers = async (): Promise<User[]> => {
  const response = await axios.get("/api/users/following");
  return response.data;
};

const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await axios.get("/api/conversations");
  return response.data;
};

const startNewConversation = async (userId: string): Promise<Conversation> => {
  const response = await axios.post("/api/conversations", { participantId: userId });
  return response.data;
};

const ConversationList: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversationList, setConversationList] = useState<Conversation[]>([]);

 

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5001"); // Adjust URL to your backend
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch following users
  const { data: followingUsers, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["followingUsers"],
    queryFn: fetchFollowingUsers,
  });

  // Fetch conversations
  const { data: conversations, isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  // Listen for new messages or updates
  useEffect(() => {
    if (!socket) return;
    if (conversations) {
      setConversationList(conversations);
    }
    socket.on("conversationUpdated", (updatedConversation: Conversation) => {
      setConversationList((prev) =>
        prev.map((conversation) =>
          conversation._id === updatedConversation._id ? updatedConversation : conversation
        )
      );
    });

    socket.on("newConversation", (newConversation: Conversation) => {
      setConversationList((prev) => [newConversation, ...prev]);
    });

    return () => {
      socket.off("conversationUpdated");
      socket.off("newConversation");
    };
  }, [socket, conversations]);

  const handleSelectConversation = async (user: User) => {
    const existingConversation = conversationList.find((conversation) =>
      conversation.participants.some((participant) => participant._id === user._id)
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      const newConversation = await startNewConversation(user._id);
      setConversationList((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
  };

  if (loadingUsers || loadingConversations) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full">
      {/* Left Panel: Following Users */}
      <div className="w-1/3 border-r bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-2">Start a New Conversation</h2>
        {followingUsers && followingUsers.length > 0 ? (
          followingUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-2 mb-2 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectConversation(user)}
            >
              <img
                src={user.profileimg}
                alt="profile"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <p className="font-medium">{`${user.firstname} ${user.lastname}`}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users to follow</p>
        )}
      </div>

      {/* Right Panel: Chat Area */}
      <div className="w-2/3 p-4">
        {selectedConversation ? (
          <ChatArea conversation={selectedConversation} socket={socket} />
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
