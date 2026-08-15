import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: "super" | "admin" | "cashier";
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      minLength: 6,
      select: false,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["super", "admin", "cashier"],
      required: [true, "role is required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", schema);

export default User;
