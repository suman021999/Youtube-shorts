// passport.config.js
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import passport from 'passport';

export const configurePassport = () => {
  // Main Google strategy
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback',
    passReqToCallback: true
  }, googleAuthCallback));

  // // Additional strategy for account switching
  // passport.use('google-switch', new GoogleStrategy({
  //   clientID: process.env.GOOGLE_CLIENT_ID,
  //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //   callbackURL: '/api/v1/auth/google/callback/switch',
  //   passReqToCallback: true
  // }, googleSwitchCallback));

  // Serialization/deserialization remains the same
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

// Regular Google auth callback
const googleAuthCallback = async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        provider: 'google'
      });
    } else if (!user.googleId) {
      user.googleId = profile.id;
      user.provider = 'google';
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

// // Special callback for account switching
// const googleSwitchCallback = async (req, accessToken, refreshToken, profile, done) => {
//   try {
//     const originalUserId = req.query.state;
//     if (!originalUserId) return done(new Error('State parameter missing'));

//     const originalUser = await User.findById(originalUserId);
//     if (!originalUser) return done(new Error('Original user not found'));

//     // Update original user with new Google credentials
//     originalUser.googleId = profile.id;
//     originalUser.email = profile.emails[0].value;
//     originalUser.name = profile.displayName;
//     originalUser.avatar = profile.photos?.[0]?.value;
//     originalUser.provider = 'google';

//     await originalUser.save();
//     return done(null, originalUser);
//   } catch (error) {
//     return done(error, null);
//   }
// };