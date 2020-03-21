const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
        done(error, user);
    });
});

passport.use('local_register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    const { firstName, lastName, password2 } = req.body;

    if (!firstName) {
        return done(null, false, { message: 'First Name Field is required' });
    }
    if (!lastName) {
        return done(null, false, { message: 'Last Name Field is required' });
    }
    if (!email) {
        return done(null, false, { message: 'Email Field is required' });
    }
    if (password.length < 5) {
        return done(null, false, { message: 'Password must be a minimum of 5 characters' });
    }
    if (password !== password2) {
        return done(null, false, { message: 'Password fields do not maatch' });
    }

    User.findOne({ email: email }).then((user) => {
        if (user) {
            return done(null, false, { message: 'Email is already in use. Try loging in' });
        } else {
            const newUser = new User({
                firstName,
                lastName,
                email,
                password,
            });

            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    if (error) throw error;

                    newUser.password = hash;
                    newUser.save()
                        .then((user) => {
                            req.flash('success_message', 'Well Done! Registeration Successful');
                            return done(null, user);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            });

        };

    });
}))


// APP LOGIN

passport.use('local_login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({ email: email }).then(user => {

        if (!user) return done(null, false, { message: 'No user found' });

        bcrypt.compare(password, user.password, (err, matched) => {

            if (err) return err;


            if (matched) {
                req.flash('success_message', 'Login Successful! Welcome To Your Dashboard');
                return done(null, user);

            } else {

                return done(null, false, { message: 'Wrong Credentials' });

            }

        });

    });

}));