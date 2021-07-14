var express = require('express');
var router = express.Router();
const Post = require('../model/Post')
const Category = require ('../model/Category')
const Comment = require ('../model/Comment')


router.get('/:id', function (req, res, next) {
  // res.render('index', { title: "30BG's Blog"});
  Category.find()
    .then(category => {
      Post.findById({
          _id: req.params.id
        }).populate("postCategory", "categoryName").populate('postComments').populate("postAuthor")
        .then(post => {
          if (!post) {
            console.log("opps")
          }
          res.render('single', {
            title: '30BGs Blog',
            post,
            user: req.user,
            category
          });
        })
        .catch(err => {
          console.log(err)
        })
    })
});

router.post("/:id/comment", function(req, res, next){
  const newComment = new Comment({
            commentName: req.body.comment_name,
            commentEmail: req.body.comment_email,
            commentWebsite: req.body.comment_website,
            commentContent: req.body.comment_content,
            commentUser: req.user.profileImage
  });

  Comment.create(newComment,(error, comment) =>{
    if(error){
      console.log(error);
    }else{
      Post.findById({_id: req.params.id})
      .then(post =>{
        post.postComments.push(comment);
        post.save()
        .then(savedPost =>{
          req.flash("success_msg", "comment added successfully");
          res.redirect(`/post/${post.id}/#comment_msg`);
        })
        .catch(err =>{
          console.log(error);
        })
      })
    }
  })
})

  




module.exports = router;