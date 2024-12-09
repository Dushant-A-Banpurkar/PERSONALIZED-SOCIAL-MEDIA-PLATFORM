/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import io, { Socket } from "socket.io-client";
import Sidebar from "./components/Sidebar";
import LoginPage from "./components/page/auth/LoginPage";
import SignupPage from "./components/page/auth/SignUpPage";
import HomePage from "./components/page/home/HomePage";
import ProfilePage from "./components/page/profile/ProfilePage";
import NotificationPage from "./components/page/notification/NotificationPage";
import GroupPage from "./components/page/group/GroupPage";
import Explore from "./components/page/search/Explore";
import MessagePage from "./components/page/message/MessagePage";
import SessionList from "./components/page/study group/SessionList";
import SessionPage from "./components/page/study group/SessionPage";

const SOCKET_URL = "http://localhost:5001";

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch the authenticated user data using React Query
  const { data: authUser, error, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (data.error) return null;
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache authUser for 5 minutes
  });

  useEffect(() => {
    if (authUser) {
      const socketInstance = io(SOCKET_URL, { withCredentials: true });
      setSocket(socketInstance);

      socketInstance.on("newMessage", (newMessage) => {
        console.log("New message received:", newMessage);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    }
  }, [authUser]);

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {authUser && <Sidebar />}
      <div className="flex-grow p-4">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/users"
            element={authUser ? <Explore /> : <Navigate to="/login" />}
          />
          <Route
            path="/group"
            element={authUser ? <GroupPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/message"
            element={authUser ? <MessagePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/sessions"
            element={authUser ? <SessionList /> : <Navigate to="/login" />}
          />
          <Route
            path="/sessions/:sessionId"
            element={
              authUser && socket ? (
                <SessionPage socket={socket} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="*"
            element={<Navigate to={authUser ? "/" : "/login"} />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
