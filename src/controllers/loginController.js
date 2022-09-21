const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const loginUser = async function (req, res) {
  try {
    let {email, password} = req.body
    if(!email){
      return res.status(400).send({
        status: false,
        msg: "Email is required"
      })
    }
    if(!password){
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
    if (checkEmaillAndPassword == null) {
      return res.status(404).send({
        status: false,
        msg: "this email and password are not register in Our Application",
      });
    }

    //if Found (Creating Jwt Token)
    let payloadDetails = {
      userId: checkEmaillAndPassword._id,
      email: checkEmaillAndPassword.email,
      password: checkEmaillAndPassword.password,
      batch: "plutonium",
    };

    //Creating Token

    let token = jwt.sign(
      {
        payloadDetails,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60,
      },
      "Group-27-Secret-Key"
    );

    //verifying the token

    res.status(201).send({ status: true, data: token });
  } catch (err) {
    return res.status(500).send({
      msg: false,
      errMessage: err.message,
      msg: "Server Error 500 !!",
    });
  }
};

module.exports.loginUser=loginUser