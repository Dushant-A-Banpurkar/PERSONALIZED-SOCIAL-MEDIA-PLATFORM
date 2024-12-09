import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Props {
  socket: Socket;
}

interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  profileImg: string;
  handRaised: boolean;
}

const SessionPage: React.FC<Props> = ({ socket }) => {
  const { sessionId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null); // State to store the mic stream
  const navigate = useNavigate();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/me");
      return response.data;
    },
  });

  const userId = authUser?._id;

  // Function to request mic permissions and start the stream
  const requestMicPermission = async () => {
    try {
      if (micStream) {
        // If mic stream already exists, stop it first
        micStream.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream); // Store the mic stream in state
      return stream;
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Function to handle mic toggling
  const toggleMic = async () => {
    if (micOn) {
      // Mute mic (stop the stream)
      micStream?.getTracks().forEach((track) => track.stop());
      setMicStream(null); // Reset the mic stream state
      setMicOn(false); // Update the mic status
    } else {
      // Unmute mic (start the stream)
      const stream = await requestMicPermission();
      if (stream) {
        setMicOn(true); // Update the mic status
      }
    }
    // Emit mic status change to the server via Socket.IO
    socket.emit("micToggle", { sessionId, micStatus: !micOn });
  };

  useEffect(() => {
    if (!userId || !sessionId) return;

    // Join the session when the component mounts
    axios
      .post(`/api/sessions/${sessionId}/join`, { userId })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error joining session:", error);
        navigate("/sessions");
      });

    // Listen for participant updates from Socket.IO
    socket.on("updateParticipants", (data: { participants: Participant[] }) => {
      setParticipants(data.participants);
      console.log("participant:", data.participants);
    });

    // Listen for raised hand updates
    socket.on("raisedHand", (data: { userId: string }) => {
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant._id === data.userId
            ? { ...participant, handRaised: true }
            : participant
        )
      );
    });

    // Cleanup on component unmount
    return () => {
      socket.off("updateParticipants");
      socket.off("raisedHand");
    };
  }, [socket, sessionId, userId, navigate]);

  const handleEndSession = () => {
    axios
      .post(`/api/sessions/${sessionId}/leave`, { userId })
      .then((response) => {
        console.log(response.data);
        navigate("/sessions");
      })
      .catch((error) => {
        console.error("Error leaving session:", error);
      });
  };

  const toggleHandRaise = () => {
    setHandRaised((prev) => !prev);
    axios
      .post(`/api/sessions/${sessionId}/raise-hand`, { userId })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error raising hand:", error);
      });
  };

  return (
    <div className="h-screen flex flex-col ml-[330px]">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Session: {sessionId}</h1>
        <button
          onClick={handleEndSession}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          End Session
        </button>
      </header>

      <div className="flex-grow p-4 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {participants.length > 0 ? (
            participants.map((participant) => (
              <div
                key={participant._id}
                className={`flex flex-col items-center justify-center border border-gray-300 rounded-lg ${
                  participant.handRaised ? "bg-yellow-400" : "bg-gray-100"
                } h-40 shadow-md`}
              >
                <img
                  src={participant.profileImg}
                  alt={`${participant.firstName} ${participant.lastName}`}
                  className="w-20 h-20 rounded-full mb-2"
                />
                <span className="text-gray-700 font-medium">
                  {participant.firstName} {participant.lastName}
                </span>
                {participant.handRaised && (
                  <span className="text-sm text-gray-800 mt-1">Hand Raised</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">
              Waiting for participants to join...
            </p>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-800 flex justify-between items-center text-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded-md ${
              micOn ? "bg-green-500" : "bg-red-500"
            } hover:bg-opacity-90 transition`}
          >
            {micOn ? "Mute Mic" : "Unmute Mic"}
          </button>

          <button
            onClick={toggleHandRaise}
            className={`px-4 py-2 rounded-md ${
              handRaised ? "bg-yellow-500" : "bg-gray-500"
            } hover:bg-opacity-90 transition`}
          >
            {handRaised ? "Lower Hand" : "Raise Hand"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
