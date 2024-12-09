import express from "express";
import cors from "cors"; // Import the cors package
import authRoutes from "./routes/auth.Routes";
import userRoutes from "./routes/user.Routes";
import postRoutes from "./routes/post.Routes";
import notificationRoutes from "./routes/notification.Routes";
import messageRoutes from "./routes/message.Routes";
import sessionRoutes from "./routes/session.Routes";
import conversationRoutes from "./routes/conversation.Routes";
import connectMongoDB from "./Database/connectMongoDB";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import CreateSession from "./models/CreateSession";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow cookies and other credentials
};
app.use(cors(corsOptions)); // Apply CORS middleware

app.use(cookieParser());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map to track active participants in sessions
const activeParticipants = new Map<string, Set<string>>(); // sessionId -> Set(userIds)

app.set("io", io);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// Route declarations
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/sessions", sessionRoutes);

// Socket.io connection logic
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
    io.on("connection", (socket) => {
      socket.on("micToggle", (data) => {
        // Broadcast mic status to all users in the session
        socket.broadcast.emit("micStatusUpdate", data);
      });
    });
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

  // Handle group chat messages
  socket.on("groupMessage", ({ sessionId, userId, message }) => {
    console.log(`Message in session ${sessionId} from user ${userId}: ${message}`);
    io.to(sessionId).emit("receiveGroupMessage", {
      userId,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle session updates
  socket.on("updateSession", async ({ sessionId, updateData }) => {
    try {
      const updatedSession = await CreateSession.findByIdAndUpdate(
        sessionId,
        updateData,
        { new: true }
      );
      if (updatedSession) {
        io.to(sessionId).emit("sessionUpdated", updatedSession);
        console.log(`Session ${sessionId} updated successfully.`);
      }
    } catch (error) {
      console.error("Error updating session:", error);
      socket.emit("error", { message: "Failed to update session" });
    }
  });
});

// Error-handling middleware
app.use((err, res) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
