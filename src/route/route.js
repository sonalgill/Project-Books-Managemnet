const express = require('express')
const router = express.Router()

const userController = require("../controllers/userController")
const loginController= require("../controllers/loginController")






//Create User API
router.post("/register", userController.createUser)

//logIn API
router.post("/login", loginController.login);


//=========================== if endpoint is not correct==========================================

router.all("/*", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})






module.exports = router
