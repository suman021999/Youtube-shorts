import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
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


    googleId: {
  type: String,
  unique: true,
  sparse: true, // allows null for non-google users
},
provider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},

    password: {
      type: String,
      // Make password optional for OAuth users
      required: function() {
        return !(this.googleId || this.provider);
      }
    },

    avatar: {
      type: String 
    },
    refreshToken: {
      type: String
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook to generate avatar from name
userSchema.pre('save', function(next) {
  if (!this.avatar && this.username) {
    // Get first two letters and convert to uppercase
    const initials = this.username.slice(0, 2).toUpperCase();
    this.avatar = initials;
  }
  next();
});

export const User = mongoose.model("User", userSchema);

