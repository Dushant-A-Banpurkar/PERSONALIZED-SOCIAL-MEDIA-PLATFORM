import { Request, Response } from "express";
import Notifications, { INotification } from "../models/notification.model";
import { AuthenticatedRequest } from "../middleware/protectRoute";

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id; // Ensure `req.user` is populated via middleware
    console.log("Fetching notifications for user ID: ", userId);

    const notifications: INotification[] = await Notifications.find({ to: userId })
      .populate({
        path: "from",
        select: "username profileimg",
      })
      .exec();

    console.log("Notifications found: ", notifications);

    // Mark notifications as read
    await Notifications.updateMany({ to: userId, read: false }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getNotifications controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    await Notifications.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotifications controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
