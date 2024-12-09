import User from "../models/user.model";
import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import generateTokenAndSetCookie from "../lib/utils/generateToken";
import { AuthenticatedRequest } from "../middleware/protectRoute";


interface SignupRequestBody {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  dateofbirth: Date;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export const signup = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response
) => {
  try {
    const { firstname, lastname, username, email, password, dateofbirth } =
      req.body;

    console.log("Request Body: ", req.body);

    if (
      !firstname ||
      !lastname ||
      !username ||
      !email ||
      !password ||
      !dateofbirth
    ) {
      return res.status(400).json({ error: "All fields are required!!!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format!!!" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already taken" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      email,
      dateofbirth,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id.toString(), res);

    res.status(201).json({
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      username: newUser.username,
      email: newUser.email,
      dateofbirth: newUser.dateofbirth,
      followers: newUser.followers,
      following: newUser.following,
      profileimg: newUser.profileimg,
      coverimg: newUser.coverimg,
    });
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid password!!!" });
    }

    generateTokenAndSetCookie(user._id.toString(), res);

    res.status(200).json({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      dateofbirth: user.dateofbirth,
      followers: user.followers,
      following: user.following,
      profileimg: user.profileimg,
      coverimg: user.coverimg,
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout=async(req:Request ,res:Response)=>{
  try {
    res.cookie("jwt"," ",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
  } catch (error) {
    console.error("Error in logout controller",error);
    res.status(500).json({error:"Internal server error"})
  }
}

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
