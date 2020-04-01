const express = require('express');
const Messages = require('../../models/Messages');
const Pictures = require('../../models/Pictures');
const Categories = require('../../models/Categories');

// const { isLoggedin, isLoggedout } = require('../../config/utilityFunctions');

const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});


router.get('/', (req, res) => {
    res.render('home/index', { title: 'Home', home: true });
});

router.get('/gallery', async(req, res) => {
    const pictures = await Pictures.find({})
        .populate('categories')
        .sort({ _id: -1 });
    const pictureNumber = pictures.length;
    const categoryNumber = (await Categories.find({})).length;

    res.render('home/gallery', { pictures, pictureNumber, categoryNumber, title: 'Gallery' });
});

router.get('/about', (req, res) => {
    res.render('home/about', { title: 'About', about: true });
});

router.get('/contact', (req, res) => {
    res.render('home/contact', { title: 'Contact', contact: true });
});

router.get('/services', (req, res) => {
    res.render('home/services', { title: 'Services', services: true });
});


router.post('/contact', async(req, res) => {
    const errors = [];
    try {
        const { fname, lname, email, subject, message } = req.body;
        if (!fname && !lname) {
            errors.push({ message: 'First Name Field and Last Name Field Cannot be Empty. Please provide at least a name' });
        }
        if (!email) {
            errors.push({ message: 'Email Field is required. So we can keep in touch' });
        }

        if (!message) {
            errors.push({ message: 'Please type in the body of your message' });
        }
        if (errors.length > 0) {
            res.render('home/contact', { errors: errors, body: req.body });
        } else {
            Messages.findOne({ subject: subject }).then(async(message) => {
                if (message) {
                    errors.push({ message: `Seems you've sent this message earlier` });
                    res.render('home/contact', { errors: errors, body: req.body });
                } else {
                    const newMessage = new Messages({
                        fname,
                        lname,
                        email,
                        subject,
                        message: req.body.message,
                    });

                    const savedMessage = await newMessage.save();

                    console.log(`message: ${savedMessage.subject} was successfully saved`);

                    req.flash('success_message', 'Thank you for contacting us. We would keep in touch!');
                    res.redirect('/contact');

                };

            });
        }

    } catch (error) {
        req.flash('error_message', `An error occured while trying to send message to database ${error}`);
        res.render('home/contact', { errors: error, body: req.body });
    }
});


module.exports = router;