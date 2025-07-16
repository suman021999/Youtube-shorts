import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
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
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true,
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
      sparse: true // Allows null values without violating unique constraint
    },
    provider: {
      type: String,
      enum: ['local', 'google'], // Can extend with other providers
      default: 'local'
    },
    avatar: {
      type: String // For storing profile picture URL from OAuth
    },
    // Consider adding refresh token for OAuth
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

// Add method to check if user has password set
userSchema.methods.hasPassword = function() {
  return !!this.password;
};

export const User = mongoose.model("User", userSchema);


