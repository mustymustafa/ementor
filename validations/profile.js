const isEmpty = require("./is-empty");
const Validator = require("validator");

module.exports = function validateProfileInput(data) {
  //data is req.body
  let errors = {};

  //if data.fn is not empty then data.fn: ''

  data.username = !isEmpty(data.username) ? data.username : "";

  data.skills = !isEmpty(data.skills) ? data.skills : "";
  data.school = !isEmpty(data.school) ? data.school : "";
  data.availablehours = !isEmpty(data.availablehours)
    ? data.availablehours
    : "";
  data.status = !isEmpty(data.status) ? data.status : "";

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "username must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "username field is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "status field is required";
  }

  if (Validator.isEmpty(data.school)) {
    errors.school = "school field is required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }

  if (Validator.isEmpty(data.availablehours)) {
    errors.availablehours = "Your Available Hours field is required";
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }

  return {
    errors,

    isValid: isEmpty(errors) //isValid is when errors is empty
  };
};
