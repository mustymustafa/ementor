const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    email: String,
    fn: String,
    email: String,
    isTutor: Boolean
  },

  text: {
    type: String,
    required: true
  },

  //category: {
  //  type: String,
  // require: true
  //},

  comments: [
    {
      user: {
        id: {
          type: Schema.Types.ObjectId,
          ref: "users"
        },
        email: String,
        fn: String,
        email: String,
        isTutor: Boolean
      },


      text: String,

      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  
  likes: [
    {
      user: {
        id: {
          type: Schema.Types.ObjectId,
          ref: "users"
        },
        email: String,
        fn: String,
        email: String,
        isTutor: Boolean
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now
  }
});

const Posts = (module.exports = mongoose.model("posts", postSchema));
