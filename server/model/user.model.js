import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Make password optional for OAuth users
      required: function() {
        return !(this.googleId || this.provider);
      }
    },
    // Add OAuth-specific fields
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    provider: {
      type: String,
      enum: ['local', 'google'], 
      default: 'local'
    },
    avatar: {
      type: String 
    },
   
    refreshToken: {
      type: String
    },
  },
  { timestamps: true }
);



export const User = mongoose.model("User", userSchema);


