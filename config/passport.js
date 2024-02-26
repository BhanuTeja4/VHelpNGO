// config/passport.js

const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  // Local strategy
  passport.use(
    'local',
    new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });

        if (!user || !(await user.comparePassword(password))) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Local signup strategy
  passport.use(
    'local-signup',
    new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
      try {
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
          return done(null, false, { message: 'Username already taken' });
        }

        const newUser = new User({ username: username, password: password });
        await newUser.save();

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: '998201847504-9k1qb78h4cqemlmns8ed555jlu5mcbf2.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });

          if (existingUser) {
            return done(null, existingUser);
          } else {
            const newUser = new User({
              googleId: profile.id,
              username: profile.displayName,
              // You might want to save other Google profile information here
            });

            await newUser.save();

            return done(null, newUser);
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Serialization and deserialization methods (unchanged)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .exec()
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
