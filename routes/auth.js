const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const jwt = require('jsonwebtoken');	
const config = require('config');
const {AuthError, AuthErrorType} = require('../errors/authError.js/index.js.js.js.js')

const router = express.Router();

//log in by name and password
router.post('/', async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validate(req.body);
    if (error) {
        const err = new AuthError(AuthErrorType.invalidUsernamePassword, error.details[0].message)
        return res.status(400).send(err);
    }

    //  Now find the user by their name
    let user = await User.findOne({ name: req.body.name });
    if (!user) {
        const err = new AuthError(AuthErrorType.incorrectNamePassword, 'Incorrect name or password.')
        return res.status(400).send(err);
    }

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        const err = new AuthError(AuthErrorType.incorrectNamePassword, 'Incorrect name or password.')
        return res.status(400).send(err);
    }

    const key = config.get('PrivateKey')
    //  console.log("private key: " + key)
 
    const token = jwt.sign({ _id: user._id }, key);

    var userData =  _.pick(user, ['_id', 'name', 'win', 'draw', 'loss']);

    var resObj = {
        userData: userData,
        token: token
    }

    res.header('x-auth-token', token).send(resObj);
    // res.send(token);

    // res.send(_.pick(user, ['_id', 'name']));
});

function validate(req) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(255).required()
    };
 
    return Joi.validate(req, schema);
}

module.exports = router;