import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/protectRoute";
import { Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";


// Fetch conversations for the authenticated user
export const getConversation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id; // User from the `protectRoute` middleware
    
    // Fetch conversations and populate participants and last message
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 }) // Sort conversations by last updated time
      .populate("participants", "firstname lastname profileimg") // Populate participant details
      .populate({
        path: "lastMessage", // Populate the last message
        model: "Message",
        select: "text attachment createdAt", // Only select relevant fields
        options: { sort: { createdAt: -1 } }, // Ensure the last message is the most recent
      });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

// Helper function to create or update a conversation when a message is sent
export const createOrUpdateConversation = async (
  senderId: string,
  receiverId: string,
  messageId: string
) => {
  const existingConversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (existingConversation) {
    // Update the existing conversation with the new message
    existingConversation.lastMessage = new mongoose.Types.ObjectId(messageId);
    existingConversation.updatedAt = new Date();
    await existingConversation.save();
    return existingConversation;
  } else {
    // Create a new conversation if one doesn't exist
    const newConversation = new Conversation({
      participants: [senderId, receiverId],
      lastMessage: new mongoose.Types.ObjectId(messageId),
    });
    await newConversation.save();
    return newConversation;
  }
};

// Start a new conversation or return an existing one
export const startConversation = async (req: AuthenticatedRequest, res: Response) => {
  const { participantId } = req.body; // The ID of the user to start a conversation with
  const userId = req.user._id; // Authenticated user ID from middleware

  try {
    // Validate the participant ID
    if (!participantId) {
      return res.status(400).json({ error: "Participant ID is required." });
    }

    // Check if a conversation already exists between the users
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
    }).populate("participants", "firstname lastname profileimg");

    if (existingConversation) {
      return res.status(200).json(existingConversation); // Return the existing conversation
    }

    // Create a new conversation if it doesn't exist
    const newConversation = new Conversation({
      participants: [userId, participantId],
    });
    await newConversation.save();

    // Populate participants for the response
    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate("participants", "firstname lastname profileimg")
      .populate("lastMessage"); // Optionally, you can populate the last message as well

    res.status(201).json(populatedConversation);
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ error: "Failed to start conversation" });
  }
};

// Fetch a specific conversation by its ID
export const getConversationById = async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params; // Get the conversation ID from the request params

  try {
    // Find the conversation by its ID
    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "firstname lastname profileimg")
      .populate({
        path: "lastMessage",
        model: "Message",
        select: "text attachment createdAt", // Populate last message fields
      });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

// Delete a conversation (optional functionality)
export const deleteConversation = async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Ensure that the user is a participant in the conversation
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized to delete this conversation" });
    }

    await Conversation.findByIdAndDelete(conversationId);
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};
