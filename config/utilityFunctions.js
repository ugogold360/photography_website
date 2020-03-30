module.exports = {
    isLoggedin: function(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash('error_message', 'Please login');
            res.redirect('/user/login');
        }
    },
    isLoggedout: function(req, res, next) {
        if (!req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/user/welcome');
        }
    },

    sessionSecret: 'thisismysecret',
    uploadDir: require('path').join(__dirname, '../public/uploads/')
}