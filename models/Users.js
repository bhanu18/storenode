const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    email_verfied_at: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
    },
    image:{
        data: Buffer,
        contentType: String
    },
    createAt: {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)