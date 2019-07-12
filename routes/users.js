const bcrypt = require('bcrypt');
const { User, validateUser, validateUserName, validateUserId } = require('../models/user');
const express = require('express');
const _ = require('lodash');
const {UsersError, UsersErrorType} = require('../errors/usersError.js')
var mongoose = require('mongoose');
const router = express.Router();


//create users
router.post('/', async (req, res) => {
    res.header('Access-Control-Allow-Origin', "*")
    // First Validate The Request
    const { error } = validateUser(req.body);
    if (error) {
        const err = new UsersError(UsersErrorType.invalidRequestBody, error.details[0].message)
        return res.status(400).send(err);
    }
 
    // Check if this user already exisits
    let user = await User.findOne({ name: req.body.name });
    if (user) {
        const err = new UsersError(UsersErrorType.userAlreadyExist, 'That user already exists!')
        return res.status(400).send(err);
    } else {
        // Insert the new user if they do not exist yet
        user = new User(_.pick(req.body, ['name', 'password']));
        // user = new User({
        //     name: req.body.name,
        //     // email: req.body.email,
        //     password: req.body.password
        // });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        // res.send(user);
        res.send(_.pick(user, ['_id', 'name', 'win', 'draw', 'loss']));
    }
});

//get user detail by id
router.get('/:id', async(req, res)=>{
    res.header('Access-Control-Allow-Origin', "*")
    // res.send(req.params.id)
    const isObjectId = validateUserId(req.params.id)

    if (!isObjectId) {
        const err = new UsersError(UsersErrorType.invlaidUserId, "Invalid id"/*error.details[0].message*/)
        return res.status(400).send(err);
    }

    var id = mongoose.Types.ObjectId(req.params.id);

    let user = await User.findOne({ _id: id});
    if (user) {
        // return res.status(400).send('That user already exists!');
        res.send(_.pick(user, ['_id', 'name', 'win', 'draw', 'loss']))

    } else {
        const err = new UsersError(UsersErrorType.userNotFound, 'User not found')
        return res.status(400).send(err);
    }
});

//add user win count
router.post('/win/:id', async(req, res)=>{
    const isObjectId = validateUserId(req.params.id)

    if (!isObjectId) {
        const err = new UsersError(UsersErrorType.invlaidUserId, "Invalid id"/*error.details[0].message*/)
        return res.status(400).send(err);
    }

    var id = mongoose.Types.ObjectId(req.params.id);

    var options = {upsert: false, new: true,}

    User.findOneAndUpdate({ _id: id}, {$inc:{win:1}}, options, function(err, usr){
            if (usr) {
                res.send(_.pick(usr, ['_id', 'name', 'win', 'draw', 'loss']))
            }else{
                const err = new UsersError(UsersErrorType.userNotFound, 'User not found')
                return res.status(400).send(err);
            }
    })

})

//add user loss count
router.post('/loss/:id', async(req, res)=>{
    const isObjectId = validateUserId(req.params.id)

    if (!isObjectId) {
        const err = new UsersError(UsersErrorType.invlaidUserId, "Invalid id"/*error.details[0].message*/)
        return res.status(400).send(err);
    }

    var id = mongoose.Types.ObjectId(req.params.id);

    var options = {upsert: false, new: true,}

    User.findOneAndUpdate({ _id: id}, {$inc:{loss:1}}, options, function(err, usr){
            if (usr) {
                res.send(_.pick(usr, ['_id', 'name', 'win', 'draw', 'loss']))
            }else{
                const err = new UsersError(UsersErrorType.userNotFound, 'User not found')
                return res.status(400).send(err);
            }
    })

})

//add user draw count
router.post('/draw/:id', async(req, res)=>{
    const isObjectId = validateUserId(req.params.id)

    if (!isObjectId) {
        const err = new UsersError(UsersErrorType.invlaidUserId, "Invalid id"/*error.details[0].message*/)
        return res.status(400).send(err);
    }

    var id = mongoose.Types.ObjectId(req.params.id);

    var options = {upsert: false, new: true,}

    User.findOneAndUpdate({ _id: id}, {$inc:{draw:1}}, options, function(err, usr){
            if (usr) {
                res.send(_.pick(usr, ['_id', 'name', 'win', 'draw', 'loss']))
            }else{
                const err = new UsersError(UsersErrorType.userNotFound, 'User not found')
                return res.status(400).send(err);
            }
    })

})
 
module.exports = router;