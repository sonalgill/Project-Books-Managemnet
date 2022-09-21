const express = require('express')
const router = express.Router()


//controller
const userController = require("../controllers/userController")
const loginController= require("../controllers/loginController")
const bookController=require("../controllers/bookcontroller")

//Create User API
router.post("/register", userController.createUser)

//logIn API
router.post("/login", loginController.loginUser);

//Create book
router.post("/books",bookController.createBook)

//get books
router.get('/books', bookController.getBooks)


//=========================== if endpoint is not correct==========================================

router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})


module.exports = router
