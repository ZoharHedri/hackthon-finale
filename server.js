const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const BusinessRoute = require('./routes/BussinesRoute');

// loading configuration setting this run on the machine
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

// mongoose connection
mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
})
    .then(() => console.log('connected to DB.'))
    .catch(err => console.log(`${err}`));

const app = express();

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: need to add some routes in routes folder
app.use('/bussiness', BusinessRoute);
// TODO: jwt token for handling user authentication
// TODO: nodemalier for sending email


const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));