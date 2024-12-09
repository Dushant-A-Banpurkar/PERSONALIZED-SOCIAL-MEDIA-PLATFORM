/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

interface Props {
  socket: any;
  setSessionId: (id: string) => void;
}

const SessionSelection: React.FC<Props> = ({ socket, setSessionId }) => {
  const [sessionName, setSessionName] = useState("");
  const [joinId, setJoinId] = useState("");

  const createSession = () => {
    if (sessionName.trim()) {
      socket.emit("createSession", sessionName);
      socket.on("sessionCreated", ({ sessionId }: { sessionId: string }) => {
        setSessionId(sessionId);
      });
    }
  };

  const joinSession = () => {
    if (joinId.trim()) {
      socket.emit("joinSession", joinId);
      setSessionId(joinId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Join or Create a Session</h1>
      <div className="flex space-x-4">
        <div>
          <input
            type="text"
            placeholder="Session Name"
            className="border px-4 py-2 rounded"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
          <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={createSession}>
            Create
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Session ID"
            className="border px-4 py-2 rounded"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
          />
          <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded" onClick={joinSession}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSelection;
