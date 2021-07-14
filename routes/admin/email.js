const express = require('express');
const router = express.Router();
const Email = require('../../model/Email')



router.get('/email', (req, res) => {
    Email.find()
        .then(email => {

            res.render('admin/all-emails', {
                layout: 'backendLayout.hbs',
                email,
                user: req.user
            })

        })
        .catch(err => {
            req.flash('success_msg', 'there was an error. Try again!')

        })

});



module.exports = router;