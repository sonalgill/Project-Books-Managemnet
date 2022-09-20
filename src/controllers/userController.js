const userModel = require("../models/userModel");

let isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};


function validateMobile($phone) {
    var phoneReg = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    if (!phoneReg.test($phone)) {
        return false;
    } else {
        return true;
    }
}

function validateEmail($email) {
    var emailReg = /^(\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3}))$/;
    if (!emailReg.test($email)) {
        return false;
    } else {
        return true;
    }
}


//==============================create user====================================//
const createUser = async (req, res) => {
  try {
    let data = req.body;
    if (Object.keys(data).length > 0) {
      let { title, name, phone, email, password, address } = data;
      if (!isValidTitle(title)) {
        res
          .status(400)
          .send({ staus: false, msg: "Title should be Mr, Mrs, Miss" });
        return;
      }

      if (!name) {
        res
          .status(400)
          .send({ staus: false, msg: "please provide valid name" });
        return;
      }

      if (!phone) {
        res
          .status(400)
          .send({ staus: false, msg: "please provide valid phone number" });
        return;
      }
      if (!email) {
        res
          .status(400)
          .send({ staus: false, msg: "please provide valid email" });
        return;
      }

      if (!password) {
        res
          .status(400)
          .send({ staus: false, msg: "Length should be between 8 to 15 letters" });
        return;
      }

      if (!address) {
        res
          .status(400)
          .send({ staus: false, msg: "please provide valid address" });
        return;
      }

      let alreadyUsedEmail = await userModel.findOne({ email });
      if (alreadyUsedEmail) {
        res
          .status(400)
          .send({ status: false, msg: "This email is already registerd" });
        return;
      }

      if (!validateMobile(phone)) {
        return res.status(400).send({
          status: false,
          msg: "please provide valid phone number",
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).send({
          status: false,
          msg: "please provide valid email",
        });
      }

      let alreadyUsedPhone = await userModel.findOne({ phone });
      if (alreadyUsedPhone) {
        res
          .status(400)
          .send({ status: false, msg: "This phone is already registerd" });
        return;
      }

      data.name=name.replace(/\s+/g,' ')


      let userData = await userModel.create(data);

      res.status(201).send({ status: true, data: userData });
    } else {
      res
        .status(400)
        .send({ status: false, msg: "Request body can not be empty" });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.createUser = createUser;
