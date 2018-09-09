const express = require('express');
const Router = express.Router();
const passport = require('passport');
const Client = require('../model/ClientsModel');
const Event = require('../model/EventModel');
const Bussiness = require('../model/BussinesModel');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto')
const mongoose = require('mongoose');
const path = require('path');


const conn = require('../config/conncetion');


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
    },

})

let upload = multer({ storage: storage }).single('avatar');

Router.post('/register', upload, async (req, res) => {
    try {
        req.check('name', 'name is required').notEmpty();
        req.check('phone', 'phone is required').notEmpty();
        req.check('email', 'email is required').notEmpty();
        req.check('password', 'password is required').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            throw errors;
        }
        req.check('phone', 'phone is not valid').isMobilePhone();
        req.check('email', 'email is not valid').isEmail();
        req.checkBody('confirmPassword', "password don't match").equals(req.body.password);
        errors = req.validationErrors();
        if (errors) {
            throw errors;
        }
        req.body.avatarUrl = req.file.filename;
        let newClient = new Client(req.body);
        let client = await newClient.save();
        res.json({ success: true, msg: "u have been registerd" });
    } catch (err) {
        res.json({ success: false, errors: err })
    }
});

Router.post('/isExists', (req, res) => {
    req.check('email', 'email is not valid').isEmail();
    req.check('email', 'email is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        // return res.send({ success: false, errors: errors });
        throw errors;
    }
    Client.findOne({ email: req.body.email })
        .then(client => {
            if (!client) {
                return res.send({ success: true, msg: "available" });
            }
            else {
                return res.send({ success: false, msg: "not available" })
            }
        })
        .catch(err => { throw err; })
})


Router.get('/events', passport.authenticate('jwt', { session: false }), (req, res) => {
    let eventsSortedByDate = req.user.events.sort(
        (event1, event2) => event2.date - event1.date
    )
    let client = {
        name: req.user.name,
        phone: req.user.phone,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl
    }
    res.send({ success: true, events: eventsSortedByDate, client: client });
})

Router.post('/events/add/:bussinessId/:workingDayId', passport.authenticate('jwt', { session: false }), (req, res) => {
    // save the event in the event
    let newEvent = new Event({
        activityId: req.body.activityId,
        bussinessId: req.params.bussinessId,
        workingDayId: req.params.workingDayId,
        date: req.body.timeDate.date,
        startingTime: req.body.timeDate.startingTime,
        status: "NEW"
    })

    newEvent.save()
        .then(event => {
            //WorkDay.findOne({ _id: req.params.workingDayId })
            //.then(workDay => {
            Bussiness.findOne({ _id: req.params.bussinessId })
                .then(bussiness => {
                    let found = bussiness.clients.find(item => item._id.toString() === req.user.id);
                    if (!found) {
                        bussiness.clients = bussiness.clients.concat(req.user._id);
                    }
                    let workDay = bussiness.workingDays.find(item => item.id === req.params.workingDayId);
                    workDay.events = workDay.events.concat(event._id);

                    bussiness.save()
                        .then(bussiness => {
                            req.user.events = req.user.events.concat(event._id);
                            req.user.save()
                                .then(client => res.send({ success: true, msg: "event has been saved" }))
                        })
                })
        })
})



Router.delete('/event/:eventId', passport.authenticate('jwt', { session: false }), (req, res) => {
    let eventId = req.params.eventId;
    let events = req.user.events;
    let index = events.findIndex(item => item.id === eventId)
    let eventDeleted = events.splice(index, 1)[0];
    req.user.events = events;
    // delete the event allso from the workDay
    Bussiness.findOne({ _id: eventDeleted.bussinessId })
        .populate("workingDays.events clients")
        .then(bussiness => {
            let workDay = bussiness.workingDays.find(day => day.id === eventDeleted.workingDayId);
            let indexEvent = workDay.events.findIndex(e => e.id === eventId);
            workDay.events.splice(indexEvent, 1);
            if (events.length === 0) {
                let clientIndex = bussiness.clients.findIndex(client => client.id === req.user.id);
                bussiness.clients.splice(clientIndex, 1);
            }
            bussiness.save()
                .then(b => {
                    req.user.save()
                        .then(user => res.send({ success: true, msg: "event deleted" }))
                        .catch(err => res.send({ success: false, msg: "something went worng please try again" }));
                })
        })

})

// this route is for getting images stored in the database
Router.get('/images/:filename', async (req, res) => {
    try {
        let file = await gfs.files.findOne({ filename: req.params.filename });
        let readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        return file;
    } catch (err) {
        res.send({ success: false, msg: err.msg });
    }
})

module.exports = Router;