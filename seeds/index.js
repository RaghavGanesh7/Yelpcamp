
const { Mongoose } = require("mongoose");
const mongoose = require("mongoose")
const { places, descriptors } = require('./places');
const Campground = require("../models/campground")
const cities = require('./cities')


mongoose.connect('mongodb://localhost:27017/yelpcamp',
{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({})
    for(let i=0;i<20;i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const price1 = Math.floor(Math.random()*1000);
        const camp = await new Campground(
            {
                author : "5ffbca914972375ff43939c4",
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image:'https://images.unsplash.com/photo-1515664952592-0891e0d5f2d0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
                price: price1,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            }
        ).save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})