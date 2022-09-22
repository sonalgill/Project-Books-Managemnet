const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const loginUser = async function (req, res) {
  try {
    let { email, password } = req.body
    if (!email) {
      return res.status(400).send({
        status: false,
        msg: "Email is required"
      })
    }
    if (!password) {
      return res.status(400).send({
        status: false,
        msg: "Password is required"
      })
    }
    let checkEmaillAndPassword = await userModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    //checking Email and Password(Present/Not)
    if (!checkEmaillAndPassword) {
      return res.status(404).send({
        status: false,
        msg: "this email and password are not register in Our Application",
      });
    }

    //Creating Token

    let token = jwt.sign(
      { userId: checkEmaillAndPassword._id },
      "Group-27-Secret-Key",
      { expiresIn: "12000s" }
    );
    let decode = jwt.verify(token, "Group-27-Secret-Key")

    res.status(201).send({
      status: true,
      data: token,
      userId: decode.userId,
      exp: decode.exp,
      iat: decode.iat,
    });
  } catch (err) {
    return res.status(500).send({
      msg: false,
      errMessage: err.message,
      msg: "Server Error 500 !!",
    });
  }
};

module.exports.loginUser = loginUser;
