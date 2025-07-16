import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: function() { return !this.googleId; }, // Required only for local auth
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
      validate: {
        validator: function(v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
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
      required: function() { return !this.googleId; }, // Not required for Google auth
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Never return password in queries
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows multiple null values for non-Google users
    },
    avatar: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
      select: false
    },
    lastLogin: {
      type: Date
    }
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to find or create Google user
userSchema.statics.findOrCreate = async function(profile) {
  let user = await this.findOne({ email: profile.emails[0].value });
  
  if (!user) {
    user = await this.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name?.givenName || profile.displayName.split(' ')[0],
      lastName: profile.name?.familyName || profile.displayName.split(' ')[1] || '',
      avatar: profile.photos?.[0]?.value || '',
      isVerified: profile.emails[0].verified || false
    });
  } else if (!user.googleId) {
    // Link Google account to existing user
    user.googleId = profile.id;
    if (!user.avatar && profile.photos?.[0]?.value) {
      user.avatar = profile.photos[0].value;
    }
    await user.save();
  }
  
  return user;
};

export const User = mongoose.model("User", userSchema);



