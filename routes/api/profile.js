require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const Profile = require("../../models/Profile");
const middleware = require("../../middleware/index");
const User = require("../../models/User");

const rating = require("../../ementor/src/components/rating/rating");
const nodemailer = require("nodemailer");

const keys = require("../../config/config.js");
var faker = require("faker");

const twilio = require("twilio");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;

const validateProfileInput = require("../../validations/profile");

nodemailer.createTestAccount((err, account) => {
  // create reusable transporter object using the default SMTP transport
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: "musty.mohammed1998@gmail.com", // generated ethereal user
      pass: "musty100" // generated ethereal password
    }
  });

  //get profile
  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const errors = {};
      Profile.findOne({ user: req.user.id })
        .populate("user", ["fn", "email"])
        .then(profile => {
          if (!profile) {
            errors.noprofile = "there is no profile for this user";
            return res.status(404).json(errors);
          }
          res.json(profile);
          console.log(profile.user);
        })
        .catch(err => res.status(404).json(err));
    }
  );

  //create profile / update

  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),

    (req, res) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions

      const { errors, isValid } = validateProfileInput(req.body);
      if (!isValid) {
        return res.status(422).json(errors);
      }
      //get fields
      const profileFields = {};
      //get fields from user. name, email and all
      profileFields.user = req.user.id;

      //check if the fields are sent in from the input field. then save it in profile field

      if (req.body.status) profileFields.status = req.body.status;

      if (req.body.bio) profileFields.bio = req.body.bio;

      if (req.body.username) profileFields.username = req.body.username;

      if (req.body.office) profileFields.office = req.body.office;

      if (req.body.school) profileFields.school = req.body.school;

      //array values. split csv into array

      if (typeof req.body.skills !== undefined) {
        profileFields.skills = req.body.skills.split(",");
      }

      //array values. split csv into array

      if (typeof req.body.availablehours !== undefined) {
        profileFields.availablehours = req.body.availablehours
          .split(",")
          .map(ah => {
            return { time: ah, user: null };
          });
      }

      //social. it has objects
      profileFields.social = {};

      if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
      if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
      if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

      //Education. it has objects
      profileFields.education = {};

      //if (req.body.school) profileFields.education.school = req.body.school;

      //update and create
      //look for user
      Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
          //update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then((profile = res.json(profile)));
        } else {
          //create
          //check if username exists before creating
          Profile.findOne({ username: profileFields.username }).then(
            profile => {
              if (profile) {
                errors.username = "That profile exists";
                res.status(404).json(errors);
              }
              //save profile
              new Profile(profileFields).save().then(profile => {
                if (profile) {
                  User.findById(req.user.id, (err, userData) => {
                    if (userData) {
                      userData.isTutor = true;
                      userData.save().then(user => {
                        console.log(user);
                        console.log(userData.email);
                      });
                    }

                    var mailOptions = {
                      from: "eMentor <musty.mohammed1998@gmail.com>", // sender address
                      to: userData.email, // list of receivers
                      subject: "Profile updated", // Subject line
                      // text: "",
                      html:
                        "<b>You have successfully Updated your eMentor Tutor's Profile</b>" // html body
                    };

                    // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        return console.log(error);
                      } else {
                        console.log("Message sent: %s", info.messageId);
                      }
                    });
                  });
                }
              });

              //update isTutor
            }
          );
        }
      });
    }
  );

  //get all profiles

  //get sitc profiles
  router.get("/sitc", (req, res) => {
    const errors = {};
    Profile.find({ school: "SITC" })
      .populate("user", ["fn", "email"])
      .sort({ rating: -1 })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there are no users here";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json({ profile: "there are no users" }));
  });

  router.get("/sas", (req, res) => {
    const errors = {};
    Profile.find({ school: "SAS" })
      .populate("user", ["fn", "email"])
      .sort({ rating: -1 })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there are no users here";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json({ profile: "there are no users" }));
  });

  router.get("/sbe", (req, res) => {
    const errors = {};
    Profile.find({ school: "SBE" })
      .populate("user", ["fn", "email"])
      .sort({ rating: -1 })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there are no users here";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json({ profile: "there are no users" }));
  });

  router.get("/sol", (req, res) => {
    const errors = {};
    Profile.find({ school: "SOL" })
      .populate("user", ["fn", "email"])
      .sort({ rating: -1 })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there are no users here";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json({ profile: "there are no users" }));
  });

  //get profile by username and get profile by ID
  // we use req.params.username to get handle online and match to the db
  router.get("/:username", (req, res) => {
    const errors = {};
    Profile.findOne({ username: req.params.username })
      .populate("user", ["fn", "email"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  });

  //search by user id

  router.get(
    "/:user_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const errors = {};
      Profile.findOne({ user: req.params.user.id })
        .populate("user", ["name", "email"])
        .then(profile => {
          if (!profile) {
            errors.noprofile = "There is no profile for this user";
            res.status(404).json(errors);
            console.log(err);
          }
          res.json(profile);
        })
        .catch(err => res.status(404).json({ profile: "There is no profile" }));
    }
  );

  //book a time

  router.get(
    "/:username/book/:bookId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const errors = {};
      Profile.findOne({ username: req.params.username })
        .populate("user", ["fn", "email"])
        .then(profile => {
          if (profile) {
            profile.availablehours.map(ah => {
              const ah1 = ah.id;

              //check if time is already booked and a user hasn't booked a time already
              if (ah.user !== null) {
                errors.booked = "This time is booked already";

                console.log("time is booked");
              }

              if (req.user.id == ah.user) {
                console.log(req.user.id == ah.user);
                errors.bookedAlready = "you have booked before";
                res.json(errors);
              } else {
                //check if the bookId matches any id in the array

                if (ah1 === req.params.bookId) {
                  //if it matches save req.user.id into ah.user
                  console.log("time is" + ah.time);
                  ah.user = req.user.id;

                  //save the schema
                  profile.save().then(profile => res.json(profile));

                  var mailOptions = {
                    from: "eMentor <musty.mohammed1998@gmail.com>", // sender address
                    to: profile.user.email, // list of receivers
                    subject: "Session Request", // Subject line
                    // text: "",
                    html:
                      "<b>" +
                      ah.time +
                      "has been requested by" +
                      req.user.email +
                      "</b>" // html body
                  };

                  // send mail with defined transport object
                  smtpTransport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      return console.log(error);
                    } else {
                      console.log("Message sent: %s", info.messageId);
                    }
                  });
                }
              }
            });
          }
        })
        .catch(err => res.json(err));
    }
  );

  router.get(
    "/:username/cancel/:bookId",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const errors = {};
      Profile.findOne({ username: req.params.username })
        .then(profile => {
          if (profile) {
            console.log(profile.username);

            profile.availablehours.map(ah => {
              const ah1 = ah.id;
              console.log(ah1);
              console.log(ah.user);

              //check if the current user is the one that booked the time

              if (ah.user == req.user.id) {
                //if it matches save initialize ah.user to null

                console.log(ah.user == req.user.id);
                ah.user = null;

                //save the schema
                profile.save().then(profile => res.json(profile));
              }
            });
          }
        })
        .catch(err => res.json(errors));
    }
  );

  //end point to generate access token
  router.get("/:id/token", (req, res) => {
    const identity = faker.name.findName();

    //create an access token
    const token = new AccessToken(
      keys.twilioAccountSid,
      keys.twilioApiKey,
      keys.twilioApiSecret
    );

    //Assign the generated identity to the token

    token.identity = identity;

    //grant access token twilio video capabilities
    const grant = new VideoGrant();
    // grant.configurationProfileSid = process.env.TWILIO_CONFIGURATION_SID;
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response
    res.json({
      identity: identity,
      token: token.toJwt()
    });

    console.log(token.toJwt());
  });

  //end point to generate access token
  router.post("/chattoken", (req, res) => {
    const identity = faker.name.findName();

    //create an access token
    const token = new AccessToken(
      keys.twilioAccountSid,
      "SK2a498c5c4287027fdafa55960ea59114",
      "MPMqpZUSMwCzUzdclQhCt3bW90dR2AWd"
    );

    //Assign the generated identity to the token

    token.identity = identity;

    //add chat grant

    token.addGrant(
      new ChatGrant({
        serviceSid: keys.twilioChatServiceSid
      })
    );

    // Serialize the token to a JWT string and include it in a JSON response

    res.send(
      JSON.stringify({
        identity: identity,
        token: token.toJwt()
      })
    );

    console.log(token.toJwt());
  });

  //end of nodemailer
});

//rating

router.post("/:username/vote", (req, res) => {
  Profile.findOne({ username: req.params.username }).then(profile => {
    console.log(profile);
    console.log(req.body.votes);

    const votes = req.body.votes;

    profile.ratings.push(votes);

    console.log(profile.ratings);
    const total = rating(profile.ratings);

    profile.rating = total;

    profile.save().then(voted => console.log(total));
  });
});

//invite route

router.post("/invite", (req, res) => {
  const email = req.body.invite;
  const link = req.body.link;

  console.log(email);
  console.log(link);

  //send email here
});

module.exports = router;
