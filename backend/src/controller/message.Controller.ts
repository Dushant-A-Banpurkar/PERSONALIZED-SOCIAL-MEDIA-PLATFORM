import { Response } from "express";
import Message from "../models/message.model";
import { AuthenticatedRequest } from "../middleware/protectRoute";
import { v2 as cloudinary } from "cloudinary";
import { Server } from "socket.io";
import { createOrUpdateConversation } from "./conversation.controller";
import mongoose from "mongoose";
import Conversation from "../models/conversation.model";


export const sendMessage = async (
  req: AuthenticatedRequest, 
  res: Response, 
  io: Server // Accept io as the third argument
) => {
  try {
    const { text, file } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    let fileUrl=null;
    if (file) {
      const uploadResponse = await cloudinary.uploader.upload(file);
      fileUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      file: fileUrl,
    });

    await newMessage.save();

    // Use io to emit a new message event if needed
    io.to(receiverId).emit("newMessage", newMessage);
    await createOrUpdateConversation(senderId, receiverId, newMessage._id.toString());
    res.status(200).json(newMessage);
  } catch (uploadError) {
    console.error("Cloudinary upload error: ", uploadError);
    return res.status(500).json({ error: "Failed to upload attachment" });
  }
};

// Get or create a conversation between two users
export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: conversationId } = req.params; // Use the conversation ID from the request
    console.log("Fetching messages for conversation:", conversationId);

    // Fetch the conversation to get the participant IDs
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const { participants } = conversation;
    console.log("Participants in conversation:", participants);

    // Fetch messages where sender and receiver match the participants
    const messages = await Message.find({
      $or: [
        { senderId: participants[0], receiverId: participants[1] },
        { senderId: participants[1], receiverId: participants[0] },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    if (!messages.length) {
      console.log("No messages found between the users.");
      return res.status(200).json([]);
    }

    console.log("Fetched messages:", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({ error: "Server error" });
  }
};