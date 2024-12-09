import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  from: Types.ObjectId;
  to: Types.ObjectId;
  type: "follow" | "like";
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notifications;
