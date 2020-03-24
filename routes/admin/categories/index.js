const express = require('express');

// const { isLoggedin, isLoggedout } = require('../../config/utilityFunctions');
const Categories = require('../../../models/Categories');

const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Categories.find({}).then((categories) => {
        res.render('admin/categories', { categories: categories });
    }).catch((error) => {
        console.log(error);
    });
});

router.post('/create', (req, res) => {
    const newCategory = new Categories({
        name: req.body.name,
        description: req.body.description
    });

    newCategory.save().then((createdCategory) => {
        req.flash('success_message', `Category: ${createdCategory.name} was created successfully`);
        res.redirect('/admin/categories');
    }).catch((error) => {
        console.log(error);
        res.redirect('/');
    })


});

module.exports = router;