require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const Profile = require("../../models/Profile");
const middleware = require("../../middleware/index");
const User = require("../../models/User");

const twilio = require("twilio");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var faker = require("faker");

const validateProfileInput = require("../../validations/profile");

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
        Profile.findOne({ username: profileFields.username }).then(profile => {
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
                  });
                }
              });
            }
          });
          //update isTutor
        });
      }
    });
  }
);

//get all profiles
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["fn", "email"])
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
      .then(profile => {
        if (profile) {
          console.log(profile.username);

          profile.availablehours.map(ah => {
            const ah1 = ah.id;
            console.log(ah1);
            console.log(ah.user);

            //check if time is already booked
            if (ah.user !== null) {
              errors.booked = "This time is booked already";
              res.json(errors);
              console.log("time is booked");
            }
            //check if the bookId matches any id in the array

            if (ah1 === req.params.bookId) {
              //if it matches save req.user.id into ah.user
              ah.user = req.user.id;
              //save the schema
              profile.save().then(profile => res.json(profile));
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

module.exports = router;
