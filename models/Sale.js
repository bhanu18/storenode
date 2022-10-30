const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    customer_id:{
        type: String,
    },
    total_price: {
        type: Number,
    },
    total_quantity:{
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Items',
        required: true,
    }
});

module.exports = mongoose.model('Sale', SaleSchema)