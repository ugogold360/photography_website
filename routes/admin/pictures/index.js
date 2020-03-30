const express = require('express');
const Categories = require('../../../models/Categories');
const Pictures = require('../../../models/Pictures');

const { uploadDir } = require('../../../config/utilityFunctions');

const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Pictures.find({})
        .populate('categories')
        .then((pictures) => {

            res.render('admin/pictures', { pictures });
        }).catch((error) => {
            console.log(error);
        });
});

router.get('/add', (req, res) => {
    Categories.find({}).then((categories) => {
        res.render('admin/pictures/add', { categories });
    }).catch((error) => {
        res.render('/admin/pictures/add', { errors: error });
    });
});
router.get('/edit/:id', (req, res) => {
    Pictures.findOne({ _id: req.params.id }).then((picture) => {
        Categories.find({}).then((categories) => {
            res.render('admin/pictures/edit', { picture, categories });
        });
    }).catch((error) => {
        console.log(error);
    });
});

router.post('/add', (req, res) => {
    var errors = [];
    if (!req.body.name) {
        errors.push({ message: 'Please provide a name for the picture' });
    }
    if (!req.files) {
        errors.push({ message: 'Please provide a picture to upload' });
    }
    if (!req.body.category) {
        errors.push({ message: 'Please select a category' });
    }
    if (errors.length > 0) {
        Categories.find({}).then((categories) => {
            res.render('admin/pictures/add', { errors: errors, body: req.body, categories });
        })
    } else {
        //  LOADING IN EXTERNAL DEFAULT IMAGE // VAR FILENAME = HTTPS://IMAGESOURE
        var file = req.files.fileName

        var fileName = Date.now() + '_' + file.name;
        const newPicture = new Pictures({
            name: req.body.name,
            status: req.body.status,
            description: req.body.description,
            categories: req.body.category,
            fileName
        });

        newPicture.save().then((savedPicture) => {
            file.mv('./public/uploads/' + fileName, function(error) {
                if (error) return error;
            });
            req.flash('success_message', `Picture "${savedPicture.name}" Uploaded successfully`);
            res.redirect('/admin/pictures');
        }).catch((validationError) => {
            Categories.find({}).then((categories) => {
                res.render('admin/pictures/add', { errors: validationError.errors, body: req.body, categories });
            });
        });

    };

});

router.put('/edit/:id', (req, res) => {

    Pictures.findOne({ _id: req.params.id }).then((picture) => {
        picture.name = req.body.name;
        picture.status = req.body.status;
        picture.description = req.body.description;
        picture.categories = req.body.category

        if (req.files) {
            let file = req.files.fileName
            let fileName = Date.now() + '_' + file.name;
            picture.fileName = fileName;

            file.mv('./public/uploads/' + fileName, function(error) {
                if (error) return error;
            });
        }

        picture.save().then((updatedPicture) => {
            req.flash('success_message', `Post "${updatedPicture.name}" modified successfully`);
            res.redirect('/admin/pictures');
        })
    }).catch((error) => {
        console.log(error);
    });
});

router.delete('/delete/:id', (req, res) => {
    Pictures.findOne({ _id: req.params.id })
        .then((pictureToDelete) => {

            require('fs').unlink(uploadDir + pictureToDelete.fileName, function() {
                pictureToDelete.remove().then(() => {
                    req.flash('success_message', `Picture: "${pictureToDelete.name}" deleted successfully`);
                    res.redirect('/admin/pictures');
                });
            });
        }).catch((error) => {
            console.log(error);
        });
});

module.exports = router;