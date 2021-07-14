const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmailSchema = new Schema({
    emailAddress:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    },

})
module.exports = mongoose.model('emails', EmailSchema)