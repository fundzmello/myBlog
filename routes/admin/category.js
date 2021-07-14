const express = require('express');
const router = express.Router();
const Category = require('../../model/Category')
const User = require('../../model/User');

router.get('/add', (req, res) => {
    res.render('admin/category/add-category', {
        layout: 'backendLayout.hbs',
        users,
    })
});


router.post('/add', (req, res) => {
    const {
        category_name,
        category_desc
    } = req.body;
    let errors = [];
    if (!category_name || !category_desc) {
        errors.push({
            msg: "please fill in all the fields"
        })
    }
    if (errors.length > 0) {
        res.render('admin/category/add-category', {
            layout: 'backendLayout.hbs',
            errors,
        })
    } else {
        //checking if category exists
        Category.findOne({
                categoryName: category_name
            })
            .then(category => {
                if (category) {
                    errors.push({
                        msg: "category already exists"
                    })
                    return res.render('admin/category/add-category', {
                        layout: 'backendLayout.hbs',
                        errors,
                    })
                }
                const newCategory = new Category({
                    categoryName: category_name,
                    categoryDesc: category_desc
                })
                newCategory.save()
                    .then(category => {
                        req.flash('success_msg', category.categoryName + ' was created successfully')
                        res.redirect('/category/add')
                    })
            })
    }
});



router.get('/all', (req, res) => {
    Category.find()
        .then(categories => {
            if (categories) {
                res.render('admin/category/all-categories', {
                    layout: 'backendLayout.hbs',
                    categories,
                })
            }
        })
        .catch(err => {
            req.flash('success_msg', 'there was an error. Try again!')

        })

});


router.get('/edit/:id', (req, res) => {

    Category.findOne({
            _id: req.params.id
        })
        .then(category => {
            if (category) {
                res.render('admin/category/edit-category', {
                    layout: 'backendLayout.hbs',
                    category
                })
            }
        })

        .catch(err => {
            req.flash("error_msg", "There was an error")
        })


});


router.get('/update', (req, res) => {
    res.render('admin/category/edit-category', {
        layout: 'backendLayout.hbs'
    })
});


router.post('/update/:id', (req, res) => {
    const {
        category_name,
        category_desc
    } = req.body;
    let errors = [];
    if (!category_name || !category_desc) {
        errors.push({
            msg: "please fill in all the fields"
        })
    }
    if (errors.length > 0) {
        res.render('admin/category/edit-category', {
            layout: 'backendLayout.hbs',
            errors
        })
    } else {
        //checking if category exists
        const updateCategory = {
            categoryName: category_name,
            categoryDesc: category_desc
        }

        Category.findOneAndUpdate({
                _id: req.params.id
            }, {
                $set: updateCategory
            }, {
                new: true
            })
            .then(category => {
                req.flash('success_msg', category.categoryName + ' was successfully updated')
                res.redirect('/category/all')
            })
            .catch(err => {
                req.flash('error_msg', "There was an error, Try Again")
            })
        // newCategory.save()
        // .then(category =>{
        //     req.flash('success_msg', category.categoryName  +  'was created successfully')
        //     res.redirect('/category/add')
        // })
    }
});

router.get('/delete/:id', (req, res) => {
    Category.findOneAndDelete({
            _id: req.params.id
        })
        .then(category => {
            req.flash('error_msg', category.categoryName + ' was successfully deleted')
            res.redirect('/category/all')
        })
        .catch(err => {
            req.flash('error_msg', "There was an error, Try Again")
        })
})


module.exports = router;