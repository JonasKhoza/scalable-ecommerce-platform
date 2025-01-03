import mongoose, { Schema, Document } from "mongoose";

//Define an interface for the token model
interface TokenI {
  token: string;
  user: Schema.Types.ObjectId; // Reference to the User model
  expiresAt: Date; // Expiration date for the refresh token
  deviceInfo: {
    //Info about the device/browser
    clientIP: string;
    clientUserAgent: string;
  };
}

interface DBTokenI extends TokenI {
  createdAt: string;
  updatedAt: string;
}

const tokenSchema = new Schema<TokenI>(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    deviceInfo: {
      type: {
        //Info about the device/browser
        clientIP: String,
        clientUserAgent: String,
      },
      required: true,
    },
  },
  { timestamps: true }
);
// Create an index on token for efficient querying and automatic cleanup
tokenSchema.index({ token: 1 });
// Create an index on `expiresAt` for efficient querying and automatic cleanup
//TTL (Time-To-Live) indexe, which automatically delete documents once a specific time field reaches its expiration value.
//expireAfterSeconds: 0 ensures that MongoDB removes the document as soon as the expiresAt time passes.
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<TokenI>("Token", tokenSchema);
//TTL (Time-To-Live) indexes, which automatically delete documents once a specific time field reaches its expiration value

export { Token, TokenI, DBTokenI };
