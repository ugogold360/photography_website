const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    fname: {
        type: String,
        trim: true

    },
    lname: {
        type: String,
        trim: true

    },
    email: {
        type: String,
        required: [true, 'Email field is Required'],
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Please type in your message']
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('messages', MessageSchema);