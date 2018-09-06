const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto')
const mongoose = require('mongoose');




// loading configuration setting this run on the machine
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });

const conn = require('./config/conncetion');

let gfs;
conn.once('open', function () {
    console.log('mongodb is connected');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

let storage = new GridFsStorage({
    url: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds125862.mlab.com:25862/hackton_db`,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
})

let upload = multer({ storage: storage });

const UserRoute = require('./routes/UserRoute');
const BusinessRoute = require('./routes/BussinesRoute');
const ActivitiesRoute = require('./routes/ActivitiesRoute');
const ClientsRoute = require('./routes/ClientsRoute');
const DashboardRoute = require('./routes/DashboardRoute');

const app = express();

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

app.use('/users', UserRoute);
app.use('/bussiness', BusinessRoute);
app.use('/clients', upload.single('avatar'), ClientsRoute);
app.use('/activities', ActivitiesRoute);
app.use('/dashboard', DashboardRoute);

// this route is for getting images stored in the database
app.get('/images/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (function (err, file) {
        if (err) return res.json({ err: "something happend" })
        var readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    }))
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));