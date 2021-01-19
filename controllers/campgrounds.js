const Campground = require("../models/campground")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const campground = require("../models/campground")
const mapBoxToken = process.env.MAPBOX_TOKEN 
geocoder = mbxGeocoding({accessToken:mapBoxToken})


module.exports.index = async(req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
}

module.exports.newCampground = async(req,res,next)=>{
    const geodata = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground =new Campground(req.body.campground)
    campground.image= req.files.map(f=>({
        url:f.path,
        filename:f.filename
    }))
    campground.geometry = geodata.body.features[0].geometry
    campground.author = req.user._id;
    await campground.save()
    console.log(campground)
    req.flash("Success","Created a campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderCampground =(req,res)=>{
    res.render("campgrounds/new")
}


module.exports.showCampground = async (req,res,next)=>{
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
}

module.exports.editCampground = async(req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground})
}
module.exports.editCampgroundPut = async(req,res,next)=>{
    const id = req.params.id
    const updatedcampground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const images= req.files.map(f=>({
        url:f.path,
        filename:f.filename
    }))
    updatedcampground.image.push(...images)
    updatedcampground.save()
    req.flash("Success","Updated Campground")
    res.redirect(`/campgrounds/${updatedcampground._id}`)
} 


module.exports.deleteCampground = async(req,res)=>{
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}
