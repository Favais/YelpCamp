const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedhelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seeddb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '67cc350215376cba855e251b',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: Math.floor(Math.random() * 20) + 10,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
            images: [
                {
                    url: 'https://res.cloudinary.com/dago3du9s/image/upload/v1741689375/yelpcamp/lenx0i1ynqb3douvxani.jpg',
                    filename: 'yelpcamp/lenx0i1ynqb3douvxani',
                },
                {
                    url: 'https://res.cloudinary.com/dago3du9s/image/upload/v1741689365/yelpcamp/vvho3jf00b1g0wyynokt.png',
                    filename: 'yelpcamp/vvho3jf00b1g0wyynokt',
                }
            ]
        });
        await camp.save();
    }
}

seeddb().then(() => {
    mongoose.connection.close();
});