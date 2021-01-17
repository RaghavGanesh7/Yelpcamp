const Campground = require("../models/campground")



module.exports.index = async(req,res,next)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
}

module.exports.newCampground = async(req,res,next)=>{
    const campground = await new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save()
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
    req.flash("Success","Updated Campground")
    res.redirect(`/campgrounds/${updatedcampground._id}`)
}


module.exports.deleteCampground = async(req,res)=>{
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}
