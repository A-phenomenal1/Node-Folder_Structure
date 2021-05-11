const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 9090;

const {
  userController,
  authUserController,
} = require("./controllers/user.controller");
const authorization = require("./api/middleware/auth");
require("./db");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is the backend");
});

app.get("/users/:id", userController);
app.use("/users", userController);

app.use("/authusers", authorization);

app.get("/authusers", authUserController);

app.listen(port, () => {
  console.log(`Server is up at port ${port}`);
});
