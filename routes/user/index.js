const express = require('express');
const csrf = require('csurf');
const passport = require('passport');

const { isLoggedin, isLoggedout } = require('../../config/utilityFunctions');

const router = express.Router();
const csrfProtection = csrf();

router.use(csrfProtection);

router.get('/logout', isLoggedin, (req, res) => {
    req.logout();
    req.flash('success_message', 'You have successfully logged out');
    res.redirect('/user/login');
});

router.get('/welcome', isLoggedin, (req, res) => {
    res.render('user/welcome');
});

router.use('/*', isLoggedout, (req, res, next) => {
    next();
});

router.get('/login', (req, res) => {
    res.render('user/login', { csrfToken: req.csrfToken() });
});


router.get('/register', (req, res) => {
    res.render('user/register', { csrfToken: req.csrfToken() });
});

router.post('/register', passport.authenticate('local_register', {
    failureRedirect: '/user/register',
    failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/welcome');
    }
});

router.post('/login', passport.authenticate('local_login', {
    failureRedirect: '/user/login',
    failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/welcome');
    };
});

module.exports = router;