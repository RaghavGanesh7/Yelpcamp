
const Campground = require("../models/campground")
const Review = require("../models/review")




module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review)
    console.log(review)
    await review.save()
    await campground.save()
    req.flash("Success","Created new review")
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteReview = async(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews: req.params.reviewid}})
    await Review.findByIdAndDelete(req.params.reviewid)
    res.redirect(`/campgrounds/${req.params.id}`)
}