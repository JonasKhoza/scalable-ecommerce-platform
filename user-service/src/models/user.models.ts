import mongoose from "mongoose";

interface AuthUserI {
  firstname?: string;
  lastname?: string;
  username: string;
  password: string;
  email: string;
  phonenumber?: number;
  numcountrycode: string;
}

interface TokenInt {
  userId: string;
  userRole: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DBUserI extends AuthUserI {
  _id: string;
  created_at: string;
  updated_at: string;
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, default: null },
    lastname: { type: String, default: null },
    phonenumber: { type: Number, default: null },
    numcountrycode: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    emailverified: { type: Boolean, default: false },
    phoneverified: { type: Boolean, default: false },

    //createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DBUser = mongoose.model("User", userSchema);

export { AuthUserI, DBUserI, DBUser, TokenInt };
