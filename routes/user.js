const express = require("express")
const router = express.Router()
const passport = require("passport")
const users = require("../controllers/users")

router.get("/register",users.createUser)

router.post("/register",users.registerUser)

router.get("/login",users.renderLogin)

router.post("/login",passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),users.loginUser)


router.get("/logout",users.logoutUser)


module.exports = router


