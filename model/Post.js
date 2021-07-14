const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    postCategory:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    postName:{
        type: String,
        required: true
    },
    postImage:{
        type: String,
        required: true
    },
    postContent:{
        type: String,
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
    allowFeatured:{
            type: Boolean,
            default: false
    },
    postComments:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }
    ],
    postAuthor:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "users"
    },  

})
module.exports = mongoose.model('post', PostSchema)