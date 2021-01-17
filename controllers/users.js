const { model } = require("mongoose")
const User = require("../models/user")


module.exports.registerUser = async(req,res)=>{
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
}

module.exports.createUser = (req,res)=>{
    res.render("users/register")
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login")
}

module.exports.loginUser = (req,res)=>{
    req.flash("Success","Welcome Back!")
    const url = req.session.returnTo
    if(!url){
        return res.redirect("/campgrounds")
    }
    res.redirect(url)
   
}

module.exports.logoutUser = (req,res)=>{
    req.logout();
    req.flash("Success","Logged Out")
    res.redirect("/campgrounds")
}