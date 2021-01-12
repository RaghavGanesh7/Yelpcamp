const express = require("express")
const router = express.Router()
const catchasync = require('../utils/catchasync')
const Campground = require("../models/campground")
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");



//Routes

router.get("/",catchasync(async(req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
}))

router.post("/",isLoggedIn,validateCampground,catchasync(async(req,res,next)=>{
    const campground = await new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save()
    req.flash("Success","Created a campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/new",(req,res)=>{
    res.render("campgrounds/new")
})

router.get("/:id",catchasync(async (req,res,next)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');  
      if(!foundcampground){
        req.flash("Error","Cannot find the campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show",{campground:foundcampground})
}))

router.get("/:id/edit", isLoggedIn,isAuthor,catchasync(async(req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground})
}))

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchasync(async(req,res,next)=>{
    const id = req.params.id
    const updatedcampground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash("Success","Updated Campground")
    res.redirect(`/campgrounds/${updatedcampground._id}`)
}))

router.delete("/:id", isLoggedIn,isAuthor,catchasync(async(req,res)=>{
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

module.exports = router;