const express = require("express")
const review = require("../models/review")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")

router.get("/register",(req,res)=>{
    res.render("users/register")
})

router.post("/register",async(req,res)=>{
    try{
    const {username,email,password} = req.body
    const user = new User({email:email,username:username})
    const newUser = await User.register(user,password)
    console.log(newUser)
    req.flash("Success","Welcome")
    res.redirect("/campgrounds")
    }catch(e){
        req.flash("Error",e.message)
        res.redirect("/register")
    }
})

router.get("/login",(req,res)=>{
    res.render("users/login")
})

router.post("/login",passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
    req.flash("Success","Welcome Back!")
    res.redirect("/campgrounds")
})


module.exports = router


