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
    req.login(newUser,err=>{
        if(err){
            return next(err)
        }
    })
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
    const url = req.session.returnTo
    if(!url){
        url = "/campgrounds"
    }
    res.redirect(url)
})


router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("Success","Logged Out")
    res.redirect("/campgrounds")
})


module.exports = router


