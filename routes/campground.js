const express = require("express")
const router = express.Router()
const catchasync = require('../utils/catchasync')
const campgrounds = require("../controllers/campgrounds")
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");



//Routes

router.get("/",catchasync(campgrounds.index))

router.post("/",isLoggedIn,validateCampground,catchasync(campgrounds.newCampground))

router.get("/new",campgrounds.renderCampground)

router.get("/:id",catchasync(campgrounds.showCampground))

router.get("/:id/edit", isLoggedIn,isAuthor,catchasync(campgrounds.editCampground))

router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchasync(campgrounds.editCampgroundPut))

router.delete("/:id", isLoggedIn,isAuthor,catchasync(campgrounds.deleteCampground))

module.exports = router;