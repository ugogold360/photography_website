const express = require('express');

// const { isLoggedin, isLoggedout } = require('../../config/utilityFunctions');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('home/index');
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

router.get('/contact', (req, res) => {
    res.render('home/contact');
});

router.get('/services', (req, res) => {
    res.render('home/services');
});


module.exports = router;