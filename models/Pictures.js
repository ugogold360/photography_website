const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PicturesSchema = new Schema({
    categories: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    name: {
        type: String,
        required: [true, 'Picture Name is Required'],
        trim: true
    },
    status: {
        type: String,
        default: 'public'
    },
    description: {
        type: String,
        trim: true
    },
    fileName: {
        type: String,
        required: [true, 'Please choose picture to upload'],
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('pictures', PicturesSchema);