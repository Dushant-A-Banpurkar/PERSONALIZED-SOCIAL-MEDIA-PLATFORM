/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Modal from "./Modal"; // Custom Modal
import toast from "react-hot-toast"; // For notifications

// Define the Session interface
interface Session {
  _id: string;
  sessionName: string;
  createdAt: string;
}

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [isJoinModal, setIsJoinModal] = useState(false);
  const [joinSessionId, setJoinSessionId] = useState("");
  const navigate = useNavigate();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/me");
      return response.data;
    },
  });

  
  // Fetch active sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("/api/sessions"); // Adjust API endpoint
        console.log("API response:", response);
  
        // Check if data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          setSessions(response.data); // Store sessions in state
          console.log("Fetched sessions:", response.data);
        } else {
          console.error("Invalid API response format:", response.data);
          
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        
      }
    };
    fetchSessions();
  }, []);

  // Open Create Session modal
  const openCreateSessionModal = () => {
    setIsJoinModal(false);
    setIsModalOpen(true);
  };

  // Open Join Session modal
  // const openJoinSessionModal = () => {
  //   setIsJoinModal(true);
  //   setIsModalOpen(true);
  // };

  // Handle creating a session
  const handleCreateSession = async () => {
    if (!sessionName) {
      toast.error("Please provide a session name.");
      return;
    }
    try {
      const response = await axios.post("/api/sessions/create", {
        sessionName,
        creatorId: authUser._id,
      });
      const newSession = {
        _id: response.data.session._id,
        sessionName: response.data.session.sessionName,
        createdAt: response.data.session.createdAt,
      };
      setSessions([...sessions, newSession]);
      setIsModalOpen(false);
      toast.success("Session created successfully!");
      navigate(`/sessions/${newSession._id}`);
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session.");
    }
  };

  // Handle joining a session
  const handleJoinSession = async () => {
    if (!joinSessionId) {
      toast.error("Please enter a valid session ID.");
      return;
    }
    try {
      // Updated to pass sessionId in the URL path
      const response = await axios.post(`/api/sessions/${joinSessionId}/join`, null, {
        headers: {
          Authorization: `Bearer ${authUser.token}`, // Assuming you use a token for authentication
        },
      });
  
      if (response.status === 200) {
        setIsModalOpen(false);
        toast.success("Successfully joined the session!");
        navigate(`/sessions/${joinSessionId}`);
      } else {
        toast.error("Failed to join the session. Please check the session ID.");
      }
    } catch (error: any) {
      console.error("Error joining session:", error);
      if (error.response?.status === 404) {
        toast.error("Session not found. Please verify the session ID.");
      } else {
        toast.error("Failed to join the session. Please try again later.");
      }
    }
  };
  

  return (
    <div className="container mx-auto p-6 ml-[330px] w-[1300px]">
      <h1 className="text-3xl font-bold mb-6">Active Sessions</h1>
      <ul className="space-y-2">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <li
              key={session._id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded shadow hover:shadow-md"
            >
              <div>
                <span className="text-lg font-medium">{session.sessionName}</span>
                <p className="text-sm text-gray-500">
                  Created At: {new Date(session.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => navigate(`/sessions/${session._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Join
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No active sessions available.</p>
        )}
      </ul>

      <div className="mt-8 flex space-x-4">
        <button
          onClick={openCreateSessionModal}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Create Meet
        </button>
        {/* <button
          onClick={openJoinSessionModal}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Join Meet
        </button> */}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isJoinModal ? "Join a Session" : "Create a Session"}
      >
        {isJoinModal ? (
          <div>
            <input
              type="text"
              value={joinSessionId}
              onChange={(e) => setJoinSessionId(e.target.value)}
              placeholder="Enter session ID"
              className="border p-2 w-full rounded"
            />
            <button
              onClick={handleJoinSession}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
            >
              Join Meet
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name"
              className="border p-2 w-full rounded"
            />
            <button
              onClick={handleCreateSession}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
            >
              Create Meet
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SessionList;
