const express = require("express")
const router = express.Router()
const passport = require("passport")
const users = require("../controllers/users")


router.route("/register")
    .get(users.createUser)
    .post(users.registerUser)

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),users.loginUser)


router.get("/logout",users.logoutUser)


module.exports = router


