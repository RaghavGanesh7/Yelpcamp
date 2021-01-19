const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema

const campgroundSchema = new Schema({
    title:String,
    image:[
        {
            url:String,
            filename:String
        }
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author : {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"reviews"
    }],
});

campgroundSchema.post('findOneAndDelete',async function (doc) {
     if(doc){
         await review.deleteMany({
             _id:{
                 $in:doc.reviews
             }
         })
     }
})

module.exports = mongoose.model("campground",campgroundSchema)