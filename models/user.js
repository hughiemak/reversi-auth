const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
var mongodb = require("mongodb")

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    // email: {
    //     type: String,
    //     required: true,
    //     minlength: 5,
    //     maxlength: 255,
    //     unique: true
    // },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    
    win: {
        type: Number,
        required: true,
        default: 0
    },
    draw: {
        type: Number,
        required: true,
        default: 0
    },
    loss: {
        type: Number,
        required: true,
        default: 0
    }
}));
 
function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        // email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

function validateUserName(name){
    const schema = Joi.string().min(5).max(50).required()
    // {
    //     name: Joi.string().min(5).max(50).required(),
    // }
    return Joi.validate(name, schema);
}

function validateUserId(id){
    
    // console.log("mongoose.Types.ObjectId.isValid(id): " + mongoose.Types.ObjectId.isValid(id))
    return mongoose.Types.ObjectId.isValid(id);
}
 
exports.User = User;
exports.validateUser = validateUser;
exports.validateUserName = validateUserName;
exports.validateUserId = validateUserId;