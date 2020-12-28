
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
    for(let i=0;i<300;i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const camp = await new Campground(
            {
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            }
        ).save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})