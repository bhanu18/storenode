const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    item_id:{
        type: mongoose.Schema.Types.ObjectId
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity:{
        type: Number
    },
    price:{
        type: String
    }
});

module.exports = mongoose.model('Items', ItemSchema);