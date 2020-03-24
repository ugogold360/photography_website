const express = require('express');
const Messages = require('../../models/Messages');

// const { isLoggedin, isLoggedout } = require('../../config/utilityFunctions');

const router = express.Router();

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/messages', (req, res) => {
    Messages.find({}).then((messages) => {
        res.render('admin/messages', { messages });
    });
});

router.get('/message', (req, res) => {
    res.render('admin/message');
});

router.get('/message/:id', async(req, res) => {
    const id = req.params.id;

    try {
        const message = await Messages.findById(id);
        res.render('admin/message', { message });
    } catch (error) {
        req.flash('error_message', `An error occured while trying to fect ${message.subject} from the database.`);
        res.render('/admin/messages');
    }
});

module.exports = router;