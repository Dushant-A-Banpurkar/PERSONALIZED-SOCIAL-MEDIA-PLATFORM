import { Request, Response } from 'express';
import User from '../models/user.model';
import Post from '../models/post.model';
import { v2 as cloudinary } from 'cloudinary';
import Notifications from '../models/notification.model';
import { AuthenticatedRequest } from "../middleware/protectRoute";

// Create a new post
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!img && !text) {
      return res.status(400).json({ error: 'Post must have text or image' });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a post
export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'You are not authorized to delete this post' });
    }

    if (post.img) {
      const imgId = post.img.split('/').pop()?.split('.')[0];
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log('Error in deletePost controller: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Comment on a post
export const commentOnPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: 'Text field is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    console.log('Error in commentOnPost controller: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Like or unlike a post
export const likeUnlikePost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // Unlike Post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      return res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      // Like Post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notifications({
        from: userId,
        to: post.user,
        type: 'like',
      });
      await notification.save();

      return res.status(200).json(post.likes);
    }
  } catch (error) {
    console.log('Error in likeUnlikePost controller: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    return res.status(200).json(posts.length ? posts : []);
  } catch (error) {
    console.log('Error in getAllPosts controller: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get liked posts by a user
export const getLikedPost = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const likedPosts = await Post.find({ _id: { $in: user.likedpost } })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.log('Error in likedPost controller: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get posts from followed users
export const followPosts = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const feedPosts = await Post.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    return res.status(200).json(feedPosts);
  } catch (error) {
    console.log('Error in getFollowingPosts controller: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get posts by username
export const getUserPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    return res.status(200).json(posts);
  } catch (error) {
    console.log('Error in getUserPosts controller: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};