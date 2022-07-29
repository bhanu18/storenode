const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
    },
    quantity:{
        type: Number,
        require: true
    },
    uid: {
        type: String
    },
    createAt: {
        type: String,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema)