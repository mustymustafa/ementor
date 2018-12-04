const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");

const cron = require("node-cron");

const keys = require("./config/config.js");

const twilio = require("twilio");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;
var faker = require("faker");

const favicon = require("serve-favicon");

const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieSession = require("cookie-session");
var bcrypt = require("bcrypt");
const passport = require("passport");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const Profile = require("./models/Profile");

var expressValidator = require("express-validator");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["mustyisawesome"]
  })
);
//configure session for tracking logins

app.use(
  session({
    secret: "musty", //change on production
    resave: true,
    saveUninitialized: false
  })
);

app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());

//db config

const db = require("./config/config").mongoURI;
//connect to mongodb
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("mongo db connected"))
  .catch(err => console.log(err));

//use cors
app.use(cors());

//use routes

app.use("/routes", express.static(path.join(__dirname, "/routes")));

const post = require("./routes/api/posts");
const profile = require("./routes/api/profile");
const home = require("./routes/api/home");

//using routes
app.use("/api", home);
app.use("/api/profile", profile);
app.use("/api/post", post);

const port = process.env.PORT || 5000;

//serve static assets if in production

if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("ementor/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "ementor", "build", "index.html"));
  });
}

//job scheduling

function intervalFunc() {
  Profile.find({}).then(profile => {
    profile.forEach(prof => {
      prof.availablehours.map(ah => {
        if (ah.user != null) {
          ah.user = null;
          //save the schema
          prof.save();
          console.log("bookings refreshed");
        } else {
          console.log("no bookings");
        }
      });
    });
  });
}
//setInterval(intervalFunc, 43200000);

cron.schedule(
  "0 2 * * *",
  () => {
    Profile.find({}).then(profile => {
      profile.forEach(prof => {
        prof.availablehours.map(ah => {
          if (ah.user != null) {
            ah.user = null;
            //save the schema
            prof.save();
            console.log("bookings refreshed");
          } else {
            console.log("no bookings");
          }
        });
      });
    });
  },
  {
    scheduled: true
  }
);

const server = app.listen(port);

const io = require("socket.io").listen(server);
