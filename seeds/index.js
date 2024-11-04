const mongoose = require('mongoose');
const Warehouse = require('../models/warehouse');
const cities = require('./cities');
const { places, descriptors } = require('./helpers');

mongoose.connect('mongodb://localhost:27017/practicehub')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Warehouse.deleteMany({}); // Clear existing warehouses

    for (let i = 0; i < 50; i++) {
        const random50 = Math.floor(Math.random() * cities.length); // Ensure this matches the array length
        const city = cities[random50]; // Get the city object

        const warehouse = new Warehouse({
            location: `${city.city}, ${city.state}`, // Construct location from city properties
            title: `${sample(descriptors)} ${sample(places)}`, // Random title from descriptors and places
            image: 'https://plus.unsplash.com/premium_photo-1661962478895-a726cd4ca7cc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            description: 'A warehouse is a large storage facility used to house goods, materials, or products before they are distributed or sold. It often serves as a hub for organizing inventory, managing stock levels, and facilitating the efficient movement of goods. Warehouses are crucial in supply chains, supporting logistics, manufacturing, and retail sectors.',
            goodsStored: city.goodsStored, // Ensure these fields are present in city object
            storageCapacity: city.storageCapacity, // Correct capitalization
            type: city.type, 
            price: Math.floor(Math.random() * (20000 - 1000 + 1)) + 1000,
            author:'6727baeeb58f50f345f0612f'
        });

        try {
            await warehouse.save(); // Save the warehouse document
        } catch (error) {
            console.error('Error saving warehouse:', error); // Log error if saving fails
        }
    }
};

seedDB().then(() => {
    mongoose.connection.close(); // Close connection after seeding
});
