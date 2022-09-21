const jwt = require("jsonwebtoken");

exports.authentication = function (req, res, next) {
  //Checking Header is coomimg from the request header or not

  try {
    let checkHeader = req.headers["token-key"];
    if (!checkHeader) {
      return res
        .status(400)
        .send({ status: false, msg: "IN Headers Section token is madatory" });
    }

    //verifing that token
    try {
      var decodedToken = jwt.verify(checkHeader, "Group-27-Secret-Key");
    } catch (err) {
      return res.status(404).send({ status: false, msg: "Token is invalid" });
    }

    //Seting userId in headers for Future Use
    req.headers["userId"] = decodedToken.payloadDetails.userId;
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: "server Error" });
  }
};

//Autherization part

exports.autherization = function (req, res, next) {
  //console.log(req.headers.userId);
  try {
    if (req.body.userId == req.headers.userId) {
      next();
    } else {
      return res
        .status(403)
        .send({ status: false, msg: "Not Autherized user" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "Server Error !!", errMessage: err.message });
  }
};
