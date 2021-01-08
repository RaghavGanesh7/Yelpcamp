const express = require("express")
const { route } = require("./campground")
const router = express.Router({mergeParams:true})
const Review = require("../models/review")
const {reviewSchema} = require("../schema");
const catchasync = require('../utils/catchasync')
const Campground = require("../models/campground")


//JOI validation

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expresserror(msg, 400)
    } else {
        next();
    }
}



//Routes

router.post("/reviews",validateReview,catchasync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash("Success","Created new review")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/reviews/:reviewid",catchasync(async(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews: req.params.reviewid}})
    await Review.findByIdAndDelete(req.params.reviewid)
    res.redirect(`/campgrounds/${req.params.id}`)
}))



module.exports=router;