const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const cloudinary = require('../../config/cloudinary');
const Post = require('../../model/Post');
// const User = require('../../model/User');
const Category = require('../../model/Category');
const {ensureAuthenticated} = require ('../../config/auth');
const User = require('../../model/User');

router.get('/add', ensureAuthenticated, (req, res) => {
    Category.find()
    .then(categories => {
        if(categories){
            console.log(categories)
            res.render('admin/post/add-post', { layout: 'backendLayout.hbs', categories,  })
        }
        else{
            req.flash('error_msg', "Category not found")
            res.redirect("/post/add")
        }
    })
    .catch(err => {
        req.flash('error_msg', "there was an error")
    })
});

router.post('/add', ensureAuthenticated,  upload.single("post_image"), async (req, res) => {
    console.log(req.file)

    try {
        const result = await cloudinary.uploader.upload(req.file.path)
        console.log(result)
        

        const {
            post_name,
            post_content,
            post_category,
            featured_post,

            
        } = req.body;
        const featured = featured_post ? true : false;
        const newPost = new Post({
            postName: post_name,
            postContent: post_content,
            postImage: result.url,  
            allowFeatured: featured,
            postCategory: post_category,
            postAuthor: req.user._id
        });
        newPost.save()
            .then(post => {
                req.flash('success_msg', post.postName + ' was created successfully')
                res.redirect('/post/add')
            })
    } catch (err) {
        console.log(err)
    }
})


router.get('/all', (req, res) => {
    Post.find().populate("postCategory", "categoryName")
        .then(post => {
            // console.log(post)
            if (post) {
                res.render('admin/post/all-post', {
                    layout: 'backendLayout.hbs',
                    post,  
                })
            }
        })
        .catch(err => {
            req.flash('success_msg', 'there was an error. Try again!')

        })

});


router.get('/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id }).populate("postCategory", "categoryName")
        .then(post => {
            if (post) {
                Category.find()
                .then(categories => {
                    res.render('admin/post/edit-post', {layout: 'backendLayout.hbs',  post, categories,   })
                })
            }
        })
        .catch(err => {
            req.flash("error_msg", "There was an error")
        })


});


router.get('/update', (req, res) => {
    res.render('admin/post/edit-post', {
        layout: 'backendLayout.hbs',  
    })
});


router.post('/update/:id', (req, res) => {
    const {
        post_name,
        post_content,
        
    } = req.body;
    let errors = [];
    if (!post_name || !post_content) {
        errors.push({
            msg: "please fill in all the fields"
        })
    }
    if (errors.length > 0) {
        res.render('admin/post/edit-post', {
            layout: 'backendLayout.hbs',
            errors
        })
    } else {
        //checking if post exists
        const updatePost = {
            postName: post_name,
            postContent: post_content
        }

        Post.findOneAndUpdate({
                _id: req.params.id
            }, {
                $set: updatePost
            }, {
                new: true
            })
            .then(post => {
                req.flash('success_msg', post.postName + ' was successfully updated')
                res.redirect('/post/all')
            })
            .catch(err => {
                req.flash('error_msg', "There was an error, Try Again")
            })
    }
});

router.get('/delete/:id', (req, res) => {
    Post.findOneAndDelete({
            _id: req.params.id
        })
        .then(post => {
            req.flash('error_msg', post.postName + ' was successfully deleted')
            res.redirect('/post/all')
        })
        .catch(err => {
            req.flash('error_msg', "There was an error, Try Again")
        })
})



module.exports = router;