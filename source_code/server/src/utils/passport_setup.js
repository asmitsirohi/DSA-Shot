const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          authId: profile.id,
          loginMethod: "google",
        };

        try {
          let user = await User.findOne({ authId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
};

const githubStrategy = (passport) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          authId: profile.id,
          loginMethod: "github",
        };

        try {
          let user = await User.findOne({ authId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
};

const facebookStrategy = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "email", "link", "name", "displayName"],
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          authId: profile.id,
          loginMethod: "facebook",
        };

        try {
          let user = await User.findOne({ authId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
};

const localStrategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          let user = await User.findOne({ email: email });

          if (user) {
            if (!(await bcrypt.compare(password, user.password))) {
              return done(null, false, {
                message: "Incorrect login credentials.",
              });
            }

            done(null, user);
          } else {
            return done(null, false, {
              message: "Incorrect login credentials.",
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

module.exports = {
  localStrategy,
  googleStrategy,
  githubStrategy,
  facebookStrategy,
};
