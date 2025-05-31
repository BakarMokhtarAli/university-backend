import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface JwtPayload {
  id: mongoose.Types.ObjectId;
  role: Role;
  email: string;
}

type Role = "admin" | "user" | "teacher";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;

  // methods
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

// hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// generate a token for the user
userSchema.methods.generateAuthToken = function () {
  const payload: JwtPayload = {
    id: this._id,
    role: this.role,
    email: this.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
