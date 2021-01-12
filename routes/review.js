const express = require("express")
const { route } = require("./campground")
const router = express.Router({mergeParams:true})
const Review = require("../models/review")
const {reviewSchema} = require("../schema");
const catchasync = require('../utils/catchasync')
const Campground = require("../models/campground")
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');



//JOI validation



//Routes

router.post("/reviews",isLoggedIn,validateReview,catchasync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review)
    console.log(review)
    await review.save()
    await campground.save()
    req.flash("Success","Created new review")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/reviews/:reviewid",isLoggedIn,isReviewAuthor,catchasync(async(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews: req.params.reviewid}})
    await Review.findByIdAndDelete(req.params.reviewid)
    res.redirect(`/campgrounds/${req.params.id}`)
}))



module.exports=router;