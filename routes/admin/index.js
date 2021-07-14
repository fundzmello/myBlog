const express = require('express');
const router = express.Router();
const Category = require('../../model/Category');
const Post = require('../../model/Post');
const User = require('../../model/User');
const {accessControl}  = require("../../config/accessControl")
const {ensureAuthenticated} = require ('../../config/auth')


router.get('/', ensureAuthenticated, accessControl, (req,res) =>{
     Category.find()
     .then(categories => {
         Post.find()
         .then(post =>{
            User.find()
            .then(users =>{
                res.render('admin/dashboard', {layout:"backendLayout.hbs", title:"Admin||dashboard",post, categories, users, user: req.user})
            })
         })
     })

    }
)

module.exports = router;