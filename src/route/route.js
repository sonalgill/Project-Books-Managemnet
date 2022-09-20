const express = require('express')
const router = express.Router()







//=========================== if endpoint is not correct==========================================
router.all("/*", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})


module.exports = router