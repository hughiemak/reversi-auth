const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const jwt = require('jsonwebtoken');	
const config = require('config');
const router = express.Router();

//log in by name and password
router.post('/', async (req, res) => {
    // First Validate The HTTP Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //  Now find the user by their name
    let user = await User.findOne({ name: req.body.name });
    if (!user) {
        return res.status(400).send('Incorrect name or password.');
    }

    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect name or password.');
    }
 
    const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name']));
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