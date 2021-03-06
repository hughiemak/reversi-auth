const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const express = require('express');
const auth = require('./routes/auth');
const config = require('config');
const app = express();
var cors = require('cors');


if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}
 
//mongodb+srv://admin:<password>@cluster0-4gwwx.azure.mongodb.net/test?retryWrites=true&w=majority
//mongodb://localhost/mongo-games
mongoose.connect('mongodb+srv://admin:admin@cluster0-4gwwx.azure.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false})
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));
 
app.use(express.json());
app.use(cors());
app.use('/api/users', users);
app.use('/api/auth', auth);
 
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));