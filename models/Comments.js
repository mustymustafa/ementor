const mongoose = require("mongoose");
const schema = mongoose.Schema;

const commentSchema = new schema({
  user: {
    id: {
      type: schema.Types.ObjectId,
      ref: "user"
    },
    fn: String,
    email: String,
    isTutor: Boolean
  },

  post: {
    id: {
      type: schema.Types.ObjectId,
      ref: "posts"
    }
  },

  likes: [
    {
      user: {
        type: schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],

  text: {
    type: String
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const Comment = (module.exports = mongoose.model("comments", commentSchema));
