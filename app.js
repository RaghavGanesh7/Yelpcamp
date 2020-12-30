const express = require("express");
const { Mongoose } = require("mongoose");
const app = express()
const path = require("path")
const ejsmate = require('ejs-mate')
const mongoose = require("mongoose")
const Campground = require("./models/campground")
const methodOverride = require("method-override");
const { title } = require("process");


app.engine('ejs',ejsmate)
app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('', express.static(__dirname + '/node_modules/jquery/dist'));





mongoose.connect('mongodb://localhost:27017/yelpcamp',
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});


app.get("/campgrounds", async (req,res)=>{
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index",{campgrounds})
})

app.post("/campgrounds", async(req,res)=>{
    const campground = await new Campground(req.body.campground).save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new")
})

app.get("/campgrounds/:id", async (req,res)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id)
    res.render("campgrounds/show",{campground:foundcampground})
})

app.get("/campgrounds/:id/edit", async(req,res)=>{
    const id = req.params.id
    const foundcampground = await Campground.findById(id)
    res.render("campgrounds/edit",{campground:foundcampground})
})

app.put("/campgrounds/:id",async(req,res)=>{
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete("/campgrounds/:id", async(req,res)=>{
    const id = req.params.id
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})
app.listen(3000,()=>{
    console.log("Server is running");
})