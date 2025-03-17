// import mongoose from 'mongoose';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    fullname: {         //01
        type: String,
        required: true,

    },
    phoneno: {         //02
        type: Number,
        required: true,

    },

    email: {                    //03
        type: String,
        required: true,
        unique: true,
    },
    alternateemail: {             //04
        type: String
    },
    password: {                         //05
        type: String
    },
    role_id: {                   //06             
        type: String,
        enum: [1, 2],
        // default: '1'
    },
    alternatephone: {
        type: Number
    },
    date_of_joining: {   //07
        type: Date,
        min: '2020-01-01'
    },
    profileImage: {  //08        
        type: String
    },
    devRole: {    //09
        type: String
    },
    reportingperson: {           //11
        type: String
    },
    panNumber: {                     //12
        type: String
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    children: 
    [
        { type: mongoose.Schema.Types.ObjectId,
             ref: 'User' }
            ],
});

const User = mongoose.model('user', UserSchema);
// User.createIndexes();

module.exports = User;
// export default = mongoose.model('user', UserSchema);