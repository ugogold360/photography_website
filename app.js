const express = require('express');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const expHbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const { mongoDBUrl } = require('./config/DB/database');

const { sessionSecret } = require('./config/utilityFunctions');

require('./config/passport');

const app = express();


mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then((database) => {
    console.log(`connection to database successful`);
}).catch((error) => {
    console.log(`Could not connect to DB Error... ${error}`);
});
app.use(express.static('./public'));

app.engine('hbs', expHbs({ defaultLayout: 'home', extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars) }));

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: sessionSecret,
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.loggedinUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    next();
});

const home = require('./routes/home/index');
const user = require('./routes/user/index');
const admin = require('./routes/admin/index');
const categories = require('./routes/admin/categories/index');

app.use('/', home);
app.use('/user', user);
app.use('/admin', admin);
app.use('/admin/categories', categories);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});