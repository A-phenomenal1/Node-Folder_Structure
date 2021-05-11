const jwt = require("jsonwebtoken");
const makeHttpError = require("../../helpers/http-error");

const secret = "LB-store";

const authorization = function (req, res, next) {
  console.log("Hello Middleare");
  const token = req.headers["auth-token"];
  let msg = { auth: false, message: "No token provided." };
  if (!token) {
    next(msg.message);
    return makeHttpError({
      statusCode: 500,
      errorMessage: msg,
    });
  }
  jwt.verify(token, secret, (err, decoded) => {
    msg = { auth: false, message: "Invalid Signature." };
    if (err) {
      next(msg.message);
      return makeHttpError({
        statusCode: 500,
        errorMessage: msg,
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authorization;
