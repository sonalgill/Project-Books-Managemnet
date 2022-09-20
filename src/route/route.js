const express = require('express')
const router = express.Router()

const userController=require("../controllers/userController")





//=========================== if endpoint is not correct==========================================
router.all("/*", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})

router.post("/register",userController.createUser)



module.exports = router