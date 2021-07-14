  var express = require('express');
  var router = express.Router();
  const Post = require('../model/Post');
  const Email = require("../model/Email");
  const Category = require('../model/Category');
  const User = require('../model/User');


  router.get('/', function (req, res, next) {
    // res.render('index', { title: "30BG's Blog"});
    Category.find()
      .then(category => {
        User.find()
          .then(users => {
            console.log(users)
            Post.find().populate("postCategory", "categoryName")
              .populate('postAuthor')
              .then(post => {
                if (!post) {
                  console.log("opps")
                }
                res.render('index', {
                  title: '30BGs Blog',
                  post,
                  category,
                  users,
                  user: req.user
                });
              })
              .catch(err => {
                console.log(err)
              })
          })
      })

  });


  router.post("/email", (req, res) => {
    const newEmail = new Email({
      emailAddress: req.body.email_sub
    })
    newEmail.save()
      .then(email => {
        req.flash('success_msg', email.emailAddress + ' was created successfully')
        res.redirect('/#email')
      })
      .catch(err => {
        console.log(err)
      })
  });

  router.get('/search', function (req, res, next) {
    queryy = req.query.q
    Category.find()
      .then(category => {
        Post.find({
            postName: {
              "$regex": queryy,
              "$options": "i"
            }
          })
          .populate('postCategory', 'categoryName')
          .then(posts => {
            res.render('search-results', {
              posts,
              category,
              title: `Search results for '${queryy}'`,
              user: req.user
            });
          }).catch(err => {
            req.flash("error_msg", "There was an Error. Try again");
          });
      })

  });








  module.exports = router;
