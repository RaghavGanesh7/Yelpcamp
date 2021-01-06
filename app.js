const express = require("express");
const { Mongoose } = require("mongoose");
const app = express()
const path = require("path")
const ejsmate = require('ejs-mate')
const mongoose = require("mongoose")
const Campground = require("./models/campground")
const methodOverride = require("method-override");
const { title } = require("process");
const catchasync = require('./utils/catchasync')
const expresserror = require('./utils/expresserror')
const Joi = require('joi')
const {campgroundSchema} = require('./schema')
const Review = require("./models/review")
const {reviewSchema} = require("./schema");
const campground = require("./models/campground");


app.engine('ejs',ejsmate)
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('', express.static(__dirname + '/node_modules/jquery/dist'));


mongoose.connect('mongodb://localhost:27017/yelpcamp',
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});



//VALIDATION

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg, 400)
    } else {
        next();
    }
}

//CAMPGROUNDS


app.get("/campgrounds", catchasync(async(req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
}))

app.post("/campgrounds",validateCampground, catchasync(async(req,res,next)=>{

    const campground = await new Campground(req.body.campground).save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id", catchasync(async (req,res,next)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id).populate("reviews")
    res.render("campgrounds/show",{campground:foundcampground})
}))

app.get("/campgrounds/:id/edit", catchasync(async(req,res,next)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground:foundcampground})
}))

app.put("/campgrounds/:id",validateCampground,catchasync(async(req,res,next)=>{
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete("/campgrounds/:id", catchasync(async(req,res)=>{
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

//REVIEWS



app.post("/campgrounds/:id/reviews",validateReview,catchasync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete("/campgrounds/:id/reviews/:reviewid",catchasync(async(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews: req.params.reviewid}})
    await Review.findByIdAndDelete(req.params.reviewid)
    res.redirect(`/campgrounds/${req.params.id}`)
}))


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