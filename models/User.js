const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is Required'],
        trim: true

    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required'],
        trim: true

    },
    email: {
        type: String,
        required: [true, 'Email field is Required'],
        trim: true,
        unique: [true, 'Email already exist']

    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// UserSchema.methods.encryptPassword = function(password) {
//     return bcrypt.genSalt(10, (error, salt) => {
//         bcrypt.hash(password, salt, (error, hash) => {
//             return hash;
//         });
//     });
// };

// UserSchema.methods.comparePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// }

module.exports = mongoose.model('users', UserSchema);