const requiredParam = require("../helpers/required-param");
const { InvalidPropertyError } = require("../helpers/errors");
const isValidEmail = require("../helpers/is-valid-email.js");
const upperFirst = require("../helpers/upper-first");
const { hashPassword } = require("../helpers/hash-password");

function makeUser(userInfo = requiredParam("userInfo")) {
  console.log("userInfo: ", userInfo);
  const validUser = validate(userInfo);
  // console.log("validUser: ", validUser);
  const normalUser = normalize(validUser);
  // console.log("normalUser: ", normalUser);
  return Object.freeze(normalUser);

  function validate({
    name = requiredParam("name"),
    email = requiredParam("email"),
    password = requiredParam("password"),
    ...otherInfo
  } = {}) {
    validateName("name", name);
    validateEmail(email);
    // validatePassword(password, cnfpassword);
    return { name, email, password, ...otherInfo };
  }

  function validateName(label, name) {
    if (name.length < 3) {
      throw new InvalidPropertyError(
        `A user's ${label} must be at least 3 characters long.`
      );
    }
  }

  function validateEmail(emailAddress) {
    if (!isValidEmail(emailAddress)) {
      throw new InvalidPropertyError("Invalid contact email address.");
    }
  }

  // function validatePassword(password, ...otherInfo) {
  //   console.log(otherInfo);
  //   let otherinfo = { ...otherInfo };
  //   if (password !== otherinfo.cnfpassword) {
  //     throw new InvalidPropertyError(
  //       "Password and Confirm Password is different"
  //     );
  //   }
  // }

  function normalize({ email, name, password, ...otherInfo }) {
    return {
      ...otherInfo,
      name: upperFirst(name),
      email: email.toLowerCase(),
      password: hashPassword(password),
    };
  }
}

module.exports = makeUser;
