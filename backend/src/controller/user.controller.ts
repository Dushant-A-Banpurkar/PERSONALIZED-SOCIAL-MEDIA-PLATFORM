import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express"; // Import types from express
import Notifications from "../models/notification.model";
import User from "../models/user.model";
import { AuthenticatedRequest } from "../middleware/protectRoute";
import { Buffer } from "buffer";
import { Readable } from "stream";


// Define User type if using a custom model or schema
interface IUser {
  _id: string;
  username: string;
  password: string | null;
  following: string[];
  followers: string[];
  fullname?: string;
  email?: string;
  profileimg?: string;
  coverimg?: string;
  save: () => Promise<IUser>;
  updateOne: (update: any) => Promise<void>;
  comparePassword?: (password: string) => Promise<boolean>;
}

// Define Request type extension for user field


export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnfollowUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id) as IUser;
    const currentUser = await User.findById(req.user._id) as IUser;
    console.log(currentUser)
    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow the user
      await userToModify.updateOne({ $pull: { followers: req.user._id } });
      await currentUser.updateOne({ $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await userToModify.updateOne({ $push: { followers: req.user._id } });
      await currentUser.updateOne({ $push: { following: id } });

      // Send notification to user
      const newNotification = new Notifications({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", (error as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following") as IUser;

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user: IUser) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in SuggetedUser: ", (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { firstname, lastname, email, username, password, newPassword } = req.body;
  let { profileimg, coverimg } = req.body; // Profile and Cover images (URLs or base64)
  const userId = req.user._id; // Assuming `req.user._id` contains the authenticated user ID

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Password handling logic
    if (password && newPassword) {
      // Check if the current password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedNewPassword;
    }

    // Handle profile image if it exists
    if (profileimg) {
      if (profileimg.startsWith('data:image')) {
        // If profile image is a base64 string
        const base64Data = profileimg.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const readableStream = Readable.from(buffer); // Convert buffer to a readable stream

        // Upload the image to Cloudinary
        const uploadedResponse = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
              reject(error); // Reject if there's an error
            }
            resolve(result); // Resolve with the result
          });

          readableStream.pipe(uploadStream); // Pipe the buffer stream to Cloudinary
        });

        profileimg = uploadedResponse.secure_url; // Get the uploaded image URL
      } else if (profileimg.startsWith('http')) {
        // If it's a URL, we don't need to upload it again (just save the URL)
        user.profileimg = profileimg;
      }
    }

    // Handle cover image if it exists
    if (coverimg) {
      if (coverimg.startsWith('data:image')) {
        // If cover image is a base64 string
        const base64Data = coverimg.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const readableStream = Readable.from(buffer); // Convert buffer to a readable stream

        // Upload the image to Cloudinary
        const uploadedResponse = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) {
              reject(error); // Reject if there's an error
            }
            resolve(result); // Resolve with the result
          });

          readableStream.pipe(uploadStream); // Pipe the buffer stream to Cloudinary
        });

        coverimg = uploadedResponse.secure_url; // Get the uploaded image URL
      } else if (coverimg.startsWith('http')) {
        // If it's a URL, we don't need to upload it again (just save the URL)
        user.coverimg = coverimg;
      }
    }

    // Update the user's info with the provided data or keep the old values if not provided
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profileimg = profileimg || user.profileimg;
    user.coverimg = coverimg || user.coverimg;

    // Save the updated user data
    user = await user.save();

    // Ensure password is not returned in the response
    user.password = null as any;

    return res.status(200).json(user); // Return the updated user object
  } catch (error) {
    console.error('Error in updateUser: ', error);
    res.status(500).json({ error: error });
  }
};
// Endpoint to search for users
export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { searchTerm } = req.query;
    const userId = req.user._id;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    // Search for users by username or email
    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    }).select("-password");

    // Filter users to show only those that the current user is not following
    const usersWithFollowStatus = users.map((user) => ({
      ...user.toObject(),
      isFollowing: user.followers.includes(userId),
    }));

    res.status(200).json(usersWithFollowStatus);
  } catch (error) {
    console.log("Error in searchUsers: ", (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};
export const getFollowingUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    
    // Find the current user and populate the 'following' field with user details
    const currentUser = await User.findById(userId).populate('following');
    
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the list of following users
    res.status(200).json(currentUser.following);
  } catch (error) {
    console.log("Error in getFollowingUsers: ", (error as Error).message);
    res.status(500).json({ error: (error as Error).message });
  }
};