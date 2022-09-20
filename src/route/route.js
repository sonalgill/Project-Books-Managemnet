const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

//=========================== if endpoint is not correct==========================================
// router.all("/*", function (req, res) {
//   res.status(404).send({
//     status: false,
//     message: "Make Sure Your Endpoint is Correct !!!",
//   });
// });

//logIn API
router.post("/login", loginController.login);

module.exports = router;
