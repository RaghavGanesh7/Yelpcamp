const express = require("express")
const router = express.Router()
const catchasync = require('../utils/catchasync')
const Campground = require("../models/campground")
const {campgroundSchema} = require('../schema')



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



//Routes

router.get("/", catchasync(async(req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
}))

router.post("/",validateCampground, catchasync(async(req,res,next)=>{
    const campground = await new Campground(req.body.campground).save()
    req.flash("Success","Created a campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/new",(req,res)=>{
    res.render("campgrounds/new")
})

router.get("/:id", catchasync(async (req,res,next)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id).populate("reviews")
    if(!foundcampground){
        req.flash("Error","Cannot find the campground")
        res.redirect("/campgrounds")
    }
    res.render("campgrounds/show",{campground:foundcampground})
}))

router.get("/:id/edit", catchasync(async(req,res,next)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground:foundcampground})
}))

router.put("/:id",validateCampground,catchasync(async(req,res,next)=>{
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash("Success","Updated Campground")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:id", catchasync(async(req,res)=>{
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))




module.exports = router;