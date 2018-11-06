const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTutorRegisterInput(data) {
  //data is req.body
  let errors = {};

  //if data.fn is not empty then data.fn: ''
  data.fn = !isEmpty(data.fn) ? data.fn : " ";

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength(data.fn, { min: 2, max: 30 })) {
    errors.fn = "Name field should be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.fn)) {
    errors.fn = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    errors,

    isValid: isEmpty(errors) //isValid is when errors is empty
  };
};
