const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const loginUser = async function (req, res) {
  try {
    //Creating Token

    let token = jwt.sign(
      { userId: checkEmaillAndPassword._id },
      "Group-27-Secret-Key",
      { expiresIn: "1d" }
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
      errMessage: err.message
    });
  }
};

module.exports.loginUser = loginUser;
