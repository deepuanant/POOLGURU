const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
require('dotenv').config();
const User = require('../models/user.model');
const mongoose = require('mongoose');

passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: "https://backend-ygnm.onrender.com/auth/google/callback",
    // cal: 'https://backend-ygnm.onrender.com/auth/google',
    scope: ['profile', 'email']
},
async function (accessToken, refreshToken, profile, callback) {
    try {
        console.log('Google profile:', profile);
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            const username = profile.emails[0].value.split('@')[0] + Math.random().toString(36).substring(7);
            user = new User({
                username: username,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                email: profile.emails[0].value,
                profilephoto: profile.photos[0].value,
                password: Math.random().toString(36).slice(-8) + 'aA1!',
                isVerified: true,
                role: "User",
                googleId: profile.id
            });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
        }
        
        console.log('User found or created:', user);
        callback(null, user);
    } catch (error) {
        console.error('Error in Google Strategy:', error);
        callback(error, null);
    }
}));

// passport.use(new OIDCStrategy({
//     identityMetadata: `https://login.microsoftonline.com/58e01d55-3db3-42f5-8226-934be6916ad2/v2.0/.well-known/openid-configuration`,
//     clientID: process.env.MICROSOFT_CLIENT_ID,
//     responseType: 'code id_token',
//     responseMode: 'form_post',
//     redirectUrl: 'https://backend-ygnm.onrender.com/auth/microsoft/callback',
//     clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//     validateIssuer: false,
//     passReqToCallback: false,
//     scope: ['profile', 'offline_access', 'https://graph.microsoft.com/mail.read']
//   },
//   async (iss, sub, profile, accessToken, refreshToken, done) => {
//     try {
//       let user = await User.findOne({ email: profile._json.email });
//       if (!user) {
//         user = new User({
//           username: profile._json.email.split('@')[0],
//           firstname: profile.name.givenName,
//           lastname: profile.name.familyName,
//           email: profile._json.email,
//           profilephoto: profile._json.picture,
//           password: Math.random().toString(36).slice(-8) + 'aA1!',
//           isVerified: true,
//           role: "User",
//           microsoftId: profile.oid
//         });
//         await user.save();
//       } else if (!user.microsoftId) {
//         user.microsoftId = profile.oid;
//         await user.save();
//       }
//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   }
// ));



passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user with ID:', id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('Invalid user ID during deserialization:', id);
            return done(null, false);
        }
        const user = await User.findById(id);
        if (!user) {
            console.error('User not found during deserialization:', id);
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        console.error('Error in deserializing user:', error);
        done(error, null);
    }
});



module.exports = passport;