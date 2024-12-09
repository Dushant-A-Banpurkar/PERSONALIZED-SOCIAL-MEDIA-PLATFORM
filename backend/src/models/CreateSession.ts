import mongoose, { Document, Schema } from "mongoose";

interface ICreateSession extends Document {
  sessionName: string;
  creatorId: mongoose.Types.ObjectId;
  createdAt: Date;
  isActive: boolean;
  participants: mongoose.Types.ObjectId[];
  micOnly: boolean; // New field to restrict to mic-only mode
  raisedHands: mongoose.Types.ObjectId[]; // Track raised hands
}

const CreateSessionSchema: Schema = new Schema(
  {
    sessionName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    micOnly: {
      type: Boolean,
      default: true,
    },
    raisedHands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

CreateSessionSchema.index({ creatorId: 1, isActive: 1 });

const CreateSession = mongoose.model<ICreateSession>(
  "CreateSession",
  CreateSessionSchema
);

export default CreateSession; 