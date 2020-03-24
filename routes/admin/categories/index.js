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

router.get('/create', (req, res) => {
    Categories.find({}).then((categories) => {
        res.render('admin/categories', { categories: categories });
    }).catch((error) => {
        console.log(error);
    });
});

router.get('/edit/:id', (req, res) => {

    Categories.findOne({ _id: req.params.id }).then((category) => {
        res.render('admin/categories/edit', { category: category });
    }).catch((error) => {
        console.log(error);
    });
});

router.post('/create', (req, res) => {
    const errors = [];

    if (!req.body.name) {
        errors.push({ message: 'OOPS! category name missing' });
    }

    if (req.body.name.length < 3) {
        errors.push({ message: 'OOPS! category name too short' });
    }

    if (errors.length > 0) {
        res.render('admin/categories', { errors: errors, body: req.body });
    } else {
        Categories.findOne({ name: req.body.name }).then((found) => {
                if (found) {
                    req.flash('error_message', `OOPS! Seems category name "${req.body.name}" already exists`);
                    res.redirect('/admin/categories');
                } else {
                    const newCategory = new Categories({
                        name: req.body.name,
                        description: req.body.description
                    });

                    newCategory.save().then((createdCategory) => {
                        req.flash('success_message', `Category "${createdCategory.name}" was created successfully`);
                        res.redirect('/admin/categories');
                    });
                }
            })
            .catch((error) => {
                req.flash('error_message', `OOPS! The following error occured while trying to create category: ${error}`);
                res.redirect('/admin/categories');
            });
    }
});

router.put('/edit/:id', (req, res) => {

    Categories.findOne({ _id: req.params.id }).then((category) => {
        category.name = req.body.name;
        category.description = req.body.description;
        category.save().then((updatedCategory) => {
            req.flash('success_message', `Category "${updatedCategory.name}" updated successfully`);
            res.redirect('/admin/categories');
        });
    }).catch((error) => {
        console.log(error);
    });
});

router.delete('/delete/:id', (req, res) => {

    Categories.findOne({ _id: req.params.id }).then((category) => {
        category.remove().then((deletedCategory) => {
            req.flash('error_message', `Category "${deletedCategory.name}" successfully deleted`);
            res.redirect('/admin/categories');
        });
    }).catch((error) => {
        console.log(error);
    });
});
module.exports = router;