const isEmpty = require("./is-empty");
const Validator = require("validator");

module.exports = function ValidatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : " ";

  if (!Validator.isLength(data.text, { min: 2, max: 300 })) {
    errors.text = "post must be between 2 and 30 characters";
  }

  return {
    errors,

    isValid: isEmpty(errors) //isValid is when errors is empty
  };
};
