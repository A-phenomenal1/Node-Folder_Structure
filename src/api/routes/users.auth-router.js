const makeHttpError = require("../../helpers/http-error");
const { decodeToken } = require("../../helpers/json-web-token");
const userList = require("../../services/user.service");

function makeAuthUsersEndpointHandler({ userList }) {
  return async function handle(httpRequest) {
    switch (httpRequest.method) {
      case "POST":
        break;

      case "GET":
        return getLoginUser(httpRequest);

      default:
        return makeHttpError({
          statusCode: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  async function getLoginUser(httpRequest) {
    console.log(httpRequest);
    let userId = decodeToken(httpRequest.user.id);
    console.log("userId: ", userId);
    if (userId) {
      result = await userList.findById({ userId });
      if (result.length !== 0)
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 200,
          data: JSON.stringify(result),
        };
      else
        return makeHttpError({
          statusCode: 401,
          errorMessage: "Non Authenticated User",
        });
    }
  }
}

const authUsersEndpointHandler = makeAuthUsersEndpointHandler({ userList });

module.exports = authUsersEndpointHandler;
