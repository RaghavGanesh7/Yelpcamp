const express = require("express")
const router = express.Router({mergeParams:true})
const catchasync = require('../utils/catchasync')
const reviews = require("../controllers/reviews")
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

//Routes

router.post("/reviews",isLoggedIn,validateReview,catchasync(reviews.createReview))

router.delete("/reviews/:reviewid",isLoggedIn,isReviewAuthor,catchasync(reviews.deleteReview))


module.exports=router;