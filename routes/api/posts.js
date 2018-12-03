const express = require("express");
const router = express.Router();
const passport = require("passport");

const nodemailer = require("nodemailer");

const Post = require("../../models/Posts");

const User = require("../../models/User");

const Comment = require("../../models/Comments");

const ValidatePostInput = require("../../validations/post");

nodemailer.createTestAccount((err, account) => {
  // create reusable transporter object using the default SMTP transport
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: "musty.mohammed1998@gmail.com", // generated ethereal user
      pass: "musty100" // generated ethereal password
    }
  });

  router.get("/", (req, res) => {
    Post.find()
      .sort({ date: -1 })
      .then(posts => res.json(posts))
      .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
  });

  router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const { errors, isValid } = ValidatePostInput(req.body);

      if (!isValid) {
        return res.status(422).json(errors);
      }

      const user = {
        id: req.user.id,
        fn: req.user.fn,
        email: req.user.email,
        isTutor: req.user.isTutor
      };

      const newUserPost = new Post({
        text: req.body.text,
        category: req.body.category,
        user: user
      });

      newUserPost.save().then(newpost => res.json(newpost));

      //send email to people in the post category
      //get the emails of the people in the specified category
      User.find({ school: req.body.category }).then(users => {
        users.map(user => {
          var emails = [];
          emails.push(user.email);
          console.log(emails);

          var mailOptions = {
            from: '"eMentor" <musty.mohammed1998@gmail.com>', // sender address
            to: emails, // list of receivers
            subject: "New Question Posted", // Subject line
            // text: "",
            html:
              "<p>A new question relating to your department was posted</p>" +
              "<p>" +
              "view question now:" +
              " " +
              "https://ementor.herokuapp.com/posts" +
              "</p>"
            // html body
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
      });
    }
  );

  //delete post
  router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.id.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    }
  );

  //route to comment on a  post , view the post and display comments

  router.get("/:id", (req, res) => {
    const errors = {};
    //search post
    Post.findById(req.params.id)
      .then(post => {
        res.json(post);
      })
      .catch(err => res.json("no post found"));
  });

  //get comments

  router.get("/:id/comment", (req, res) => {
    const errors = {};
    Comment.find()
      .where("post.id")
      .equals(req.params.id)
      .sort({ likes: -1 })
      .then(comment => {
        console.log("comment found");
        res.json(comment);
      })
      .catch(err => res.json("comments not found"));
  });

  //comment on a post
  router.post(
    "/:id/comment",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const { errors, isValid } = ValidatePostInput(req.body);

      if (!isValid) {
        return res.status(422).json(errors);
      }

      //find the post you want to comment on

      Post.findById(req.params.id)
        .then(post => {
          console.log("post found");
          console.log(post.id);
          const user = {
            id: req.user.id,
            fn: req.user.fn,
            email: req.user.email,
            isTutor: req.user.isTutor
          };

          const postId = {
            id: post.id
          };

          const newComment = new Comment({
            text: req.body.text,
            // avatar: req.body.avatar,
            user: user,
            post: postId
          });

          // save comment
          newComment.save().then(comment => res.json(comment));
          //send reply email
          var mailOptions = {
            from: '"eMentor" <musty.mohammed1998@gmail.com>', // sender address
            to: post.user.email, // list of receivers
            subject: "Question Answered!", // Subject line
            // text: "",
            html:
              "<p>A new  answer to your question was posted</p>" +
              "<p>" +
              "view answer here:" +
              "" +
              " https://ementor.herokuapp.com/post/" +
              postId +
              "</p>"

            // html body
          };

          // send mail with defined transport object
          smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            } else {
              console.log("Message sent: %s", info.messageId);
            }
          });
        })
        .catch(err => res.json(err));
    }
  );

  //@route POST /post/:id/comment/:id
  //@desc to like a comment
  //@access protected

  router.post(
    "/:id/comment/:commentId/like",
    passport.authenticate("jwt", { session: false }),

    (req, res) => {
      // find the comment
      Comment.findById(req.params.commentId)
        .then(comment => {
          console.log("comment found" + comment._id + comment.length);
          if (
            comment.likes.filter(
              like => like.user._id.toString() === req.user.id
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this comment" });
          }

          //add user id to likes array
          comment.likes.unshift({ user: req.user.id });

          comment.save().then(comment => res.json(comment));
        })
        .catch(err => res.json(err));
    }
  );

  //@route POST /post/:id/comment/:commentid/unliked
  //@desc to unlike a comment
  //@access protected

  router.post(
    "/:id/comment/:commentId/unlike",
    passport.authenticate("jwt", { session: false }),

    (req, res) => {
      // find the comment

      Comment.findById(req.params.commentId)
        .then(comment => {
          console.log("comment found" + comment._id + comment.likes.length);
          if (
            comment.likes.filter(
              like => like.user._id.toString() === req.user.id
            ).length === 0
          ) {
            return res
              .status(400)
              .json({ unliked: "You have not yet liked this comment" });
          }

          //get the  index to remove

          const removeIndex = comment.likes
            .map(item => item.user._id.toString())
            .indexOf(req.user.id);

          //splice user id from the array
          comment.likes.splice(removeIndex, 1);

          comment.save().then(comment => res.json(comment));
        })
        .catch(err => res.json(err));
    }
  );

  // @route   DELETE api/posts/comment/:id/:comment_id
  // @desc    Remove comment from post
  // @access  Private

  router.delete(
    "/:id/comment/:commentId/delete",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      // find the comment

      Comment.findByIdAndRemove(req.params.commentId)
        .then(comment => {
          console.log("comment found" + comment._id);
          res.json(comment);
        })
        .catch(err => res.json(err));
    }
  );

  //end of nodemailer
});

module.exports = router;
