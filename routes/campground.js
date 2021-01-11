const express = require("express")
const router = express.Router()
const catchasync = require('../utils/catchasync')
const Campground = require("../models/campground")
const {campgroundSchema} = require('../schema')
const isLoggedIn = require("../middleware")


//JOI Validation

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg, 400)
    } else {
        next();
    }
}

const isAuthor = async(req,res,next)=>{
    const id = req.params.id
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash("Error","You do not have permission to the operation")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}


//Routes

router.get("/",catchasync(async(req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
}))

router.post("/",validateCampground,isLoggedIn ,catchasync(async(req,res,next)=>{
    const campground = await new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash("Success","Created a campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("campgrounds/new")
})

router.get("/:id",isLoggedIn,catchasync(async (req,res,next)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id).populate("reviews").populate("author")
    if(!foundcampground){
        req.flash("Error","Cannot find the campground")
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/show",{campground:foundcampground})
}))

router.get("/:id/edit", isLoggedIn,catchasync(async(req,res,next)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground:foundcampground})
}))

router.put("/:id",validateCampground,isLoggedIn,catchasync(async(req,res,next)=>{
    const id = req.params.id
    const updatedcampground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash("Success","Updated Campground")
    res.redirect(`/campgrounds/${updatedcampground._id}`)
}))

router.delete("/:id", isLoggedIn,catchasync(async(req,res)=>{
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))




module.exports = router;