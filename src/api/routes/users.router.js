const {
  UniqueConstraintError,
  InvalidPropertyError,
  RequiredParameterError,
} = require("../../helpers/errors");
const { hashCompare } = require("../../helpers/hash-password");
const makeHttpError = require("../../helpers/http-error");
const { createToken, decodeToken } = require("../../helpers/json-web-token");
const makeUser = require("../../models/user.models");
const userList = require("../../services/user.service");

function makeUsersEndpointHandler({ userList }) {
  return async function handle(httpRequest) {
    console.log(httpRequest);
    switch (httpRequest.method) {
      case "POST":
        if (httpRequest.path === "/signup") {
          return createUser(httpRequest);
        } else if (httpRequest.path === "/login") {
          return loginUser(httpRequest);
        }

      case "GET":
        return getUser(httpRequest);

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  async function getUser(httpRequest) {
    const { id } = httpRequest.pathParams || {};
    const { max, before, after, email } = httpRequest.queryParams || {};

    if (id) {
      result = await userList.findById({ userId: id });
    } else if (email) {
      result = await userList.findByEmail({ email });
    } else {
      result = await userList.getItems({ max, before, after });
    }

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      data: JSON.stringify(result),
    };
  }

  async function createUser(httpRequest) {
    let userInfo = httpRequest.body;
    if (!userInfo) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof httpRequest.body === "string") {
      try {
        userInfo = JSON.parse(userInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      const user = makeUser(userInfo);
      const result = await userList.add(user);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        data: result,
      };
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
            ? 400
            : 500,
      });
    }
  }

  async function loginUser(httpRequest) {
    let loginInfo = httpRequest.body;
    if (loginInfo.email === undefined) {
      return makeHttpError({
        statusCode: 400,
        errorMessage: "Bad request. No POST body.",
      });
    }

    if (typeof httpRequest.body === "string") {
      try {
        loginInfo = JSON.parse(loginInfo);
      } catch {
        return makeHttpError({
          statusCode: 400,
          errorMessage: "Bad request. POST body must be valid JSON.",
        });
      }
    }

    try {
      result = await userList.findByEmail({ email: loginInfo.email });
      if (result.length === 0) {
        return makeHttpError({
          statusCode: 401,
          errorMessage: "Non Authenticated User",
        });
      }
      let isMatch = hashCompare(loginInfo.password, result[0].password);
      if (isMatch) {
        let Access_Token = createToken(result[0].id, "1h");
        let Session_Token = createToken(Access_Token);
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
          data: JSON.stringify(Session_Token),
        };
      }
      return makeHttpError({
        statusCode: 401,
        errorMessage: "Username or Password is wrong",
      });
    } catch (e) {
      return makeHttpError({
        errorMessage: e.message,
        statusCode:
          e instanceof UniqueConstraintError
            ? 409
            : e instanceof InvalidPropertyError ||
              e instanceof RequiredParameterError
            ? 400
            : 500,
      });
    }
  }
}

const usersEndpointHandler = makeUsersEndpointHandler({ userList });

module.exports = usersEndpointHandler;
