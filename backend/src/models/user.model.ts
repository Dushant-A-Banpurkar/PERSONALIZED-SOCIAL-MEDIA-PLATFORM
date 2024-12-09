import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    dateofbirth: { type: Date, required: true },
    following: [{ type: mongoose.Schema.ObjectId, ref: "User", default: [] }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User", default: [] }],
    profileimg: { type: String },
    coverimg: { type: String },
    likedpost: [{ type: mongoose.Schema.ObjectId, ref: "Post", default: [] }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
