const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category Name is Required'],
        trim: true,
        minlength: 3,
        maxlength: [20, 'The name of the category is too long']

    },

    description: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('categories', CategoriesSchema);