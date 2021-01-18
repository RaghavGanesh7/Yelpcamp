const express = require("express")
const multer = require("multer")
const router = express.Router()
const catchasync = require('../utils/catchasync')
const campgrounds = require("../controllers/campgrounds")
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const {storage} = require("../cloudinary/index")
var upload = multer({ storage })



//Routes

router.get("/",catchasync(campgrounds.index))

router.post("/",isLoggedIn,upload.array("image"),validateCampground,catchasync(campgrounds.newCampground))

router.get("/new",campgrounds.renderCampground)

router.get("/:id",catchasync(campgrounds.showCampground))

router.get("/:id/edit", isLoggedIn,isAuthor,catchasync(campgrounds.editCampground))

router.put("/:id",isLoggedIn,isAuthor,upload.array("image"),validateCampground,catchasync(campgrounds.editCampgroundPut))

router.delete("/:id", isLoggedIn,isAuthor,catchasync(campgrounds.deleteCampground))

module.exports = router;