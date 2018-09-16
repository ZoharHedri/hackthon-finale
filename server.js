const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const cors = require('cors');

// loading configuration setting this run on the machine
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

const conn = require('./config/conncetion');

const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

let gfs;
conn.once('open', function () {
    console.log('mongodb is connected');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

const app = express();

// cors middleware
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express validator middleware
app.use(expressValidator());

// intialize passport
app.use(passport.initialize());

// setting up passport to use the jwt strategy
require('./config/passport')(passport);

const UserRoute = require('./routes/UserRoute');
const BusinessRoute = require('./routes/BussinesRoute');
const ActivitiesRoute = require('./routes/ActivitiesRoute');
const ClientsRoute = require('./routes/ClientsRoute');
const DashboardRoute = require('./routes/DashboardRoute');

app.use('/users', UserRoute);
app.use('/bussiness', BusinessRoute);
app.use('/clients', ClientsRoute);
app.use('/activities', ActivitiesRoute);
app.use('/dashboard', DashboardRoute);

// this route is for getting images stored in the database
app.get('/images/:filename', async (req, res) => {
    try {
        let file = await gfs.files.findOne({ filename: req.params.filename });
        let readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        return file;
    } catch (err) {
        res.send({ success: false, msg: err.msg });
    }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));