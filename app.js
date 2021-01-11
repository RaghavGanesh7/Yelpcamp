const express = require("express");
const app = express()
const path = require("path")
const ejsmate = require('ejs-mate')
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const { title } = require("process");
const expresserror = require('./utils/expresserror')
const Joi = require('joi')
const campgroundrouter = require("./routes/campground")
const reviewrouter = require("./routes/review")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const userRoutes = require("./routes/user")


app.engine('ejs',ejsmate)
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('', express.static(__dirname + '/node_modules/jquery/dist'));
app.use(session({
    secret:"notasecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expire:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

mongoose.connect('mongodb://localhost:27017/yelpcamp',
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
});

//session flash

app.use((req,res,next)=>{
    res.locals.success = req.flash("Success")
    res.locals.error = req.flash("Error")
    next()
})



app.use("/",userRoutes)

//CAMPGROUNDS

app.use("/campgrounds",campgroundrouter)


//REVIEWS


app.use("/campgrounds/:id",reviewrouter)


//Error handling

app.all("*",(req,res,next)=>{
    next(new expresserror(401,"Page not found."))
})

app.use((err,req,res,next)=>{
    const{statusCode=500, message="Something wrong"} = err;
    res.status(statusCode).render('error',{err})
})

app.listen(3000,()=>{
    console.log("Server is running");
})