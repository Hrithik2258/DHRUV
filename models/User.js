// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    fullname: {       
        type: String,
        required: true,

    },
    email: {                 
        type: String,
        required: true,
        unique: true,
    },
    password: {                         
        type: String
    },
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
