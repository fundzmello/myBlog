var express = require('express');
var router = express.Router();
var bcriptjs = require('bcrypt')



const User = require('../../model/User')
/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('authentication/register', { title: 'Blog | Sign Up' });
});


router.post('/register', function(req, res,){
    User.findOne({email: req.body.email})
    .then(user =>{
        if(user){
            return res.send({msg: 'Email is already in use'})
        }

        const newUser = new User({

            fistName: req.body.first_name,
            lastName: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        })
    
        bcriptjs.genSalt(10, (err, salt) =>{
            bcriptjs.hash(newUser.password, salt, (err, hash) =>{
                newUser.password = hash
                newUser.save()
                .then(user =>{
    //console.log(user)
                    return res.send(user);
                })
                .catch(err =>{
                    console.log(err);
                })
            })
                
            })
        })
    })


    // console.log(req.body.first_name)



router.get('/users', (req, res) =>{

    //finding all users
    User.find()
    .then(users =>{
        res.send(users)
    })
    .catch(err => console.log(err))
})



module.exports = router;
