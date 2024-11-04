const mongoose = require('mongoose');
const Schema=mongoose.Schema

const warehouseSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    goodsStored: {
        type: String,
        required: true
    },
    storageCapacity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        min: 1000,
        max: 20000
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
