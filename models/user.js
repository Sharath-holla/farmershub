const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'username',
    errorMessages: {
        MissingUsernameError: 'Username is required',
        MissingPasswordError: 'Password is required',
        IncorrectPasswordError: 'Password is incorrect',
    },
});

module.exports = mongoose.model('User', UserSchema);
