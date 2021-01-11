const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("Error","Login First")
        res.redirect("/login")
    }
    next()
}

module.exports = isLoggedIn