const mongoose = require('mongoose')

const MissedSalesSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    description:{
        type: String
    }
});

module.exports = mongoose.model( 'MisedSales', MissedSalesSchema);