var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
//creating job schema

var UserSchema = new mongoose.Schema({


  fn: {
    type: String,

    trim: true
  },

  school: {
    type: String,
    required: true
  },

  isTutor: {
    type: Boolean,
    default: false
  },

  email: {
    type: String,

    trim: true,
    unique: true,
    lowercase: true
  },

  googleId: String,

  password: {
    type: String
  },

  //profileimage: {
  //type: String
  //},

  passResetToken: String,

  passResetExpires: Date,

  createdAt: {
    type: Date,
    default: Date.now()
  },

  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

//make a model
var User = (module.exports = mongoose.model("users", UserSchema));

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.comparePassword = function(
  candidatePassword,
  password,
  callback
) {
  bcrypt.compare(candidatePassword, password, function(err, isMatch) {
    callback(null, isMatch);
  });
};

//hashing a password before saving it to the database

UserSchema.pre("save", function(next) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(this.password, salt, function(err, hash) {
      this.password = hash;
      next();
    });
  });
});
