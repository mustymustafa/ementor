const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },

  username: {
    type: String,
    required: true
  },

  social: {
    youtube: {
      type: String
    },

    twitter: {
      type: String
    },
    linkedin: {
      type: String
    },
    facebook: {
      type: String
    }
  },

  school: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  skills: {
    type: [String]
  },

  bio: {
    type: String
  },

  availablehours: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      time: String
    }
  ],

  ratings: {
    type: [Number]
  },

  rating: {
    type: Number
  },

  office: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now()
  }
});

const Profile = (module.exports = mongoose.model("profile", profileSchema));
