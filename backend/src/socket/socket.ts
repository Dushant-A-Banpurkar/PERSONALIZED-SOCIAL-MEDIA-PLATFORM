import { io } from "socket.io-client";

const activeParticipants = new Map<string, Set<string>>(); // sessionId -> Set(userIds)

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle user joining a group
  socket.on("joinGroup", ({ sessionId, userId }) => {
    if (!activeParticipants.has(sessionId)) {
      activeParticipants.set(sessionId, new Set());
    }
    activeParticipants.get(sessionId)!.add(userId);
    socket.join(sessionId);

    // Notify participants in the session
    io.to(sessionId).emit("updateParticipants", {
      participants: Array.from(activeParticipants.get(sessionId)!),
    });
    console.log(`User ${userId} joined session ${sessionId}`);
  });

  // Handle user leaving a group
  socket.on("leaveGroup", ({ sessionId, userId }) => {
    if (activeParticipants.has(sessionId)) {
      activeParticipants.get(sessionId)!.delete(userId);
      if (activeParticipants.get(sessionId)!.size === 0) {
        activeParticipants.delete(sessionId);
      }
    }
    socket.leave(sessionId);

    // Notify remaining participants
    io.to(sessionId).emit("updateParticipants", {
      participants: activeParticipants.has(sessionId)
        ? Array.from(activeParticipants.get(sessionId)!)
        : [],
    });
    console.log(`User ${userId} left session ${sessionId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    activeParticipants.forEach((users, sessionId) => {
      users.forEach((userId) => {
        if (!io.sockets.adapter.rooms.get(sessionId)?.has(socket.id)) {
          users.delete(userId);
        }
      });

      // If no users are left in the session, delete it
      if (users.size === 0) {
        activeParticipants.delete(sessionId);
      }

      // Notify remaining participants in the session
      io.to(sessionId).emit("updateParticipants", {
        participants: Array.from(users),
      });
    });

    console.log("Client disconnected:", socket.id);
  });

  // Other socket events (e.g., groupMessage, updateSession) can remain here
});
