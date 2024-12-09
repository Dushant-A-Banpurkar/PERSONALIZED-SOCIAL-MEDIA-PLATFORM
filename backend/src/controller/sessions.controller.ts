import { Request, Response } from "express";
import { Server } from "socket.io";
import { AuthenticatedRequest } from "../middleware/protectRoute";
import CreateSession from "../models/CreateSession";
import JoinSession from "../models/JoinSession";
import { Types } from "mongoose";
import { z } from "zod";

// Validation schemas using Zod
const sessionSchema = z.object({
  sessionName: z.string().min(1, "Session name is required"),
  creatorId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid creator ID"),
});

const updateSessionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

// Raise Hand
export const raiseHand = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const { userId } = req.body;
  const io: Server = req.app.get("io");

  if (!Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const session = await CreateSession.findByIdAndUpdate(
      sessionId,
      { $addToSet: { raisedHands: userId } },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    io.to(sessionId).emit("raisedHand", { userId });
    res.status(200).json({ message: "Hand raised", raisedHands: session.raisedHands });
  } catch (error) {
    console.error("Error raising hand:", error);
    res.status(500).json({ error: "Error raising hand" });
  }
};

// Create a new study session
export const createSession = async (req: AuthenticatedRequest, res: Response) => {
  const io: Server = req.app.get("io");

  try {
    const data = sessionSchema.parse(req.body);

    const newSession = await CreateSession.create(data);

    io.emit("newSession", newSession); // Notify all clients
    res.status(201).json({ message: "Session created successfully", session: newSession });
  } catch (error) {
    console.error("Error creating session:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Error creating session" });
  }
};

// Get all study sessions
export const getSessions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = req.query;
    const sessions = await CreateSession.find(filters);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Error fetching sessions" });
  }
};

// Join a study session
export const joinSession = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const { userId } = req.body;
  const io: Server = req.app.get("io");

  if (!Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const [session, existingJoinSession] = await Promise.all([
      CreateSession.findById(sessionId),
      JoinSession.findOne({ sessionId, userId, status: "joined" }),
    ]);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (existingJoinSession) {
      return res.status(400).json({ error: "User already in session" });
    }

    const newJoinSession = new JoinSession({ sessionId, userId, status: "joined" });
    await Promise.all([
      newJoinSession.save(),
      CreateSession.findByIdAndUpdate(sessionId, { $addToSet: { participants: userId } }),
    ]);

    io.to(sessionId).emit("updateParticipants", { sessionId, participants: session.participants });

    res.status(200).json({ message: "Joined session successfully", session });
  } catch (error) {
    console.error("Error joining session:", error);
    res.status(500).json({ error: "Error joining session" });
  }
};

// Update a study session
export const updateSession = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const io: Server = req.app.get("io");

  if (!Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const data = updateSessionSchema.parse(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "At least one field must be updated" });
    }

    const updatedSession = await CreateSession.findByIdAndUpdate(sessionId, data, { new: true });

    if (!updatedSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    io.to(sessionId).emit("sessionUpdated", updatedSession);

    res.status(200).json({ message: "Session updated successfully", session: updatedSession });
  } catch (error) {
    console.error("Error updating session:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Error updating session" });
  }
};

// Leave a study session
export const leaveSession = async (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  const { userId } = req.body;
  const io: Server = req.app.get("io");

  if (!Types.ObjectId.isValid(sessionId)) {
    return res.status(400).json({ error: "Invalid session ID" });
  }

  try {
    const session = await CreateSession.findByIdAndUpdate(
      sessionId,
      { $pull: { participants: userId } },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const joinSession = await JoinSession.findOneAndUpdate(
      { sessionId, userId, status: "joined" },
      { status: "left" }
    );

    if (!joinSession) {
      return res.status(400).json({ error: "User not in session" });
    }

    io.to(sessionId).emit("updateParticipants", { sessionId, participants: session.participants });

    res.status(200).json({ message: "Left session successfully", session });
  } catch (error) {
    console.error("Error leaving session:", error);
    res.status(500).json({ error: "Error leaving session" });
  }
};

