var express = require("express");
var router = express.Router();
var ejs = require("ejs");
const jwt = require("jsonwebtoken");

const keys = require("../../config/config");

let token_secret = keys.secret; //change on production

var bcrypt = require("bcryptjs"); // for hashing password
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
//handle file uploads

var User = require("../../models/User");

var shortid = require("shortid");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var passportLocalMongoose = require("passport-local-mongoose");

var crypto = require("crypto"); // for handling/generation the token encrypted data

var bcrypt = require("bcryptjs");

const configAuth = require("../../config/config");

const validateRegisterInput = require("../../validations/register");
const validateTutorRegisterInput = require("../../validations/registerTutor");
const validateLoginInput = require("../../validations/login");

//registration for users
router.get("/register", function(req, res) {});

router.post("/register", function(req, res) {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  var fn = req.body.fn;
  var email = req.body.email;
  var school = req.body.school;
  var password = req.body.password;

  User.findOne({ email: email }, "email", (err, userData) => {
    if (userData) {
      errors.alreadyexist = "Account already exists";
      res.status(404).json(errors);
    }

    var newUser = new User({
      fn: fn,
      password: bcrypt.hashSync(password, 5),
      school: school,
      email: email
    });
    newUser
      .save()
      .then(user => res.json(user))
      .catch(err => console.log(err));
  });
});

//signing in  for users

router.get("/login", function(req, res) {
  res.send("login user route");
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //login for USERS

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          isTutor: user.isTutor,
          fn: user.fn,
          email: user.email
        }; // Create JWT Payload

        // Sign Token

        jwt.sign(payload, token_secret, { expiresIn: 36000 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//PASSPORT JWT STRATEGY
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = token_secret;

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);
    User.findById(jwt_payload.id, (err, user) => {
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  })
);

//google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      //make the code asynchronous
      //User.findOne won't fire until we have all our data from google
      //this function should be called immediately in thee next event loop
      console.log(profile);
      process.nextTick(function() {
        //finding the user based on their google id
        User.findOne({ googleId: profile.id }, function(err, user) {
          if (err) return done(err);
          if (user) {
            console.log(user.username + " Already exists");
            done(null, user);
          } else {
            new User({
              //fn: profile.name,
              username: profile.displayName,
              googleId: profile.id
              //profileImage: profile.image
            })
              .save()
              .then(newUser => {
                console.log(newUser);
              });
          }
        });
      });
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

//callback after google has authenticated
router.get(
  "/auth/google/callback",

  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/register"
  })
);

//password reset for users

router.get("/forgot", function(req, res) {
  res.render("forgot");
});

router.post("/forgot", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        //to generate token
        crypto.randomBytes(20, function(err, buf) {
          if (err) {
            return console.log(err);
          }
          var token = buf.toString("hex");
          console.log(token);
          done(err, token);
        });
      },
      //function to set token
      function(token, done) {
        var email = req.body.email;
        User.findOne({ email: email }, "email, username", (err, userData) => {
          if (!userData) {
            return res.send("No user with such email was found...try again");
          }

          userData.passResetToken = token; //
          userData.passResetExpires = Date.now() + 36000;
          userData.save(function(err) {
            done(err, token, userData);
          });
        });
      },

      //function to send token to user email
      function(token, userData, done) {
        var smtpTransporter = nodemailer.createTransport({
          service: "Gmail",

          auth: {
            user: "musty.mohammed1998@gmail.com", // generated ethereal user
            pass: "musty100" // generated ethereal password
          }
        });

        var mailOptions = {
          to: req.body.email,
          from: "OutsourceNG",
          subject: "OUTSOURCENG Password Reset",
          text:
            "Hi," +
            "\n\n" +
            userData.username +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged"
        };

        // send mail with defined transport object
        smtpTransporter.sendMail(mailOptions, (error, info) => {
          console.log("Message sent: %s");
          done(error, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

//reset route

router.get("/reset/:token", function(req, res) {
  User.find(
    { passResetToken: req.params.token, passResetExpires: { $gt: Date.now() } },
    function(err, userData) {
      if (!userData) {
        console.log("token is invalid or has expired");
        return res.redirect("/forgot");
      }
      res.render("newpassword", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", function(req, res) {
  var newPassword = req.body.password;
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            passResetToken: req.params.token,
            passResetExpires: { $gt: Date.now() }
          },
          function(err, userData) {
            if (!userData) {
              console.log("expired");
              return res.redirect("back");
            }
            if (newPassword === req.body.confirmP) {
              userData.password = bcrypt.hashSync(newPassword, 10); // or you can include a pre hook to hash password before saving in your User schema
              userData.passResetExpires = null;
              userData.passResetToken = null;
              userData.save(function(err) {
                req.logIn(userData, function(err) {
                  done(err, userData);
                });
              });
            } else {
              console.log("passwords do not match");

              res.redirect("back");
            }
          }
        );
      },
      function(userData, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "musty.mohammed1998@gmail.com", // generated ethereal user
            pass: "musty100" // generated ethereal password
          }
        });
        var mailOptions = {
          to: userData.email,
          from: "passwordreset@demo.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            userData.email +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect("/");
    }
  );
});

//password rest for Tutor

router.get("/forgotfl", function(req, res) {
  res.render("forgotfl");
});

router.post("/forgotfl", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        //to generate token
        crypto.randomBytes(20, function(err, buf) {
          if (err) {
            return console.log(err);
          }
          var token = buf.toString("hex");
          console.log(token);
          done(err, token);
        });
      },
      //function to set token
      function(token, done) {
        var email = req.body.email;
        Tutor.findOne({ email: email }, "email, username", (err, flData) => {
          if (!flData) {
            return res.send("No Tutor with such email was found...try again");
          }

          flData.passResetToken = token; //
          flData.passResetExpires = Date.now() + 36000;
          flData.save(function(err) {
            done(err, token, flData);
          });
        });
      },

      //function to send token to user email
      function(token, flData, done) {
        var smtpTransporter = nodemailer.createTransport({
          service: "Gmail",

          auth: {
            user: "musty.mohammed1998@gmail.com", // generated ethereal user
            pass: "musty100" // generated ethereal password
          }
        });

        var mailOptions = {
          to: req.body.email,
          from: "OutsourceNG",
          subject: "OUTSOURCENG Password Reset",
          text:
            "Hi," +
            " " +
            " " +
            flData.username +
            "http://" +
            req.headers.host +
            "/resetfl/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged"
        };

        // send mail with defined transport object
        smtpTransporter.sendMail(mailOptions, (error, info) => {
          console.log("Message sent: %s");
          done(error, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect("/forgotfl");
    }
  );
});

//reset route

router.get("/resetfl/:token", function(req, res) {
  Tutor.find(
    { passResetToken: req.params.token, passResetExpires: { $gt: Date.now() } },
    function(err, flData) {
      if (!flData) {
        console.log("token is invalid or has expired");
        return res.redirect("/forgotfl");
      }
      res.render("newpasswordfl", { token: req.params.token });
    }
  );
});

router.post("/resetfl/:token", function(req, res) {
  var newPassword = req.body.password;
  async.waterfall(
    [
      function(done) {
        Tutor.findOne(
          {
            passResetToken: req.params.token,
            passResetExpires: { $gt: Date.now() }
          },
          function(err, flData) {
            if (!flData) {
              console.log("expired");
              return res.redirect("back");
            }
            if (newPassword === req.body.confirmP) {
              flData.password = bcrypt.hashSync(newPassword, 10); // or you can include a pre hook to hash password before saving in your User schema
              flData.passResetExpires = null;
              flData.passResetToken = null;
              flData.save(function(err) {
                req.logIn(flData, function(err) {
                  done(err, flData);
                });
              });
            } else {
              console.log("passwords do not match");

              res.redirect("back");
            }
          }
        );
      },
      function(flData, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "musty.mohammed1998@gmail.com", // generated ethereal user
            pass: "musty100" // generated ethereal password
          }
        });
        var mailOptions = {
          to: fl.email,
          from: "passwordreset@demo.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            flData.email +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect("/");
    }
  );
});

//creating a login middleware for both users and fl

//logout for users and Tutor

router.get("/logout", function(req, res) {
  if (re) {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  }
});

module.exports = router;
