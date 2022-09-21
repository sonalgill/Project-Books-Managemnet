const express = require("express");
const router = express.Router();

//controller
const userController = require("../controllers/userController");
const loginController = require("../controllers/loginController");
const bookController = require("../controllers/bookcontroller");

//middleware
const middleware = require("../middleware/auth");

//Create User API
router.post("/register", userController.createUser);

//logIn API
router.post("/login", loginController.loginUser);

//Create book
router.post(
  "/books",
  middleware.authentication,
  middleware.autherization,
  bookController.createBook
);

//=========================== if endpoint is not correct==========================================

router.all("/*", function (req, res) {
  res.status(404).send({
    status: false,
    message: "Make Sure Your Endpoint is Correct !!!",
  });
});

module.exports = router;
