import mongoose, { Document, Schema } from "mongoose";

type SessionStatus = "joined" | "left";

interface IJoinSession extends Document {
  sessionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  joinedAt: Date;
  status: SessionStatus;
}

const JoinSessionSchema: Schema = new Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreateSession",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["joined", "left"],
      default: "joined",
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

// Indexes for efficient queries
JoinSessionSchema.index({ sessionId: 1, userId: 1 });
JoinSessionSchema.index({ status: 1 });

// Add static methods for common queries
JoinSessionSchema.statics.getUserSessions = function (userId: mongoose.Types.ObjectId) {
  return this.find({ userId }).populate("sessionId");
};

const JoinSession = mongoose.model<IJoinSession>("JoinSession", JoinSessionSchema);

export default JoinSession;
