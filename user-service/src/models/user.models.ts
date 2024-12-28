import mongoose from "mongoose";

interface AuthUserI {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

interface DBUserI extends AuthUserI {
  _id: string;
  created_at: string;
  updated_at: string;
}

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },

  //createdAt: { type: Date, default: Date.now },
});

const DBUser = mongoose.model("User", userSchema);

export { AuthUserI, DBUserI, DBUser };
