const makeUser = require("../models/user.models");
const { UniqueConstraintError } = require("../helpers/errors");
const database = require("../db");

function makeUserList() {
  return Object.freeze({
    add,
    findByEmail,
    findById,
    getItems,
    remove,
    replace,
    update,
  });

  async function getItems({ max = 100, before = 1000, after = 1 } = {}) {
    const db = await database;
    let sql = `SELECT * FROM users WHERE id <= ${before} AND id>=${after} LIMIT ${max}`;
    return new Promise((res, rej) => {
      db.query(sql, (err, result) => {
        if (err) {
          return rej(err);
        }
        return res(JSON.parse(JSON.stringify(result)));
      });
    });
  }

  async function add({ ...user }) {
    const db = await database;
    let sql = "INSERT INTO users (name,contact,email, password) VALUES ?";
    let value = [[user.name, user.contact, user.email, user.password]];
    return new Promise((res, rej) => {
      db.query(sql, [value], (err, result) => {
        if (err) {
          const errorCode = err.message.split(":");
          if (errorCode[0] === "ER_DUP_ENTRY") {
            const mongoIndex = errorCode[1].split(" ");
            return rej(
              new UniqueConstraintError(mongoIndex[mongoIndex.length - 1])
            );
          }
          return rej(err);
        }
        return {
          success: result.ok === 1,
          created: res(documentToUser(user)),
        };
      });
    });
  }

  async function findById({ userId }) {
    const db = await database;
    let sql = "SELECT * FROM users WHERE id =" + userId;
    return new Promise((res, rej) => {
      db.query(sql, (err, result) => {
        if (err) {
          return rej(err);
        }
        return res(JSON.parse(JSON.stringify(result)));
      });
    });
  }

  async function findByEmail({ email }) {
    const db = await database;
    let sql = `SELECT * FROM users WHERE email = '${email}'`;
    return new Promise((res, rej) => {
      db.query(sql, (err, result) => {
        if (err) {
          return rej(err);
        }
        return res(JSON.parse(JSON.stringify(result)));
      });
    });
  }

  async function remove({ userId, ...user }) {
    // const db = await database;
    // if (userId) {
    //   user._id = db.makeId(userId);
    // }
    // const { result } = await db.collection("users").deleteMany(user);
    // return result.n;
  }

  // todo:
  async function replace(user) {}

  // todo:
  async function update(user) {}

  function documentToUser(...doc) {
    return makeUser(...doc);
  }
}

const userList = makeUserList();

module.exports = userList;
