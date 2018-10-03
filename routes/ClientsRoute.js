const express = require('express');
const Router = express.Router();
const passport = require('passport');
const Client = require('../model/ClientsModel');
const Event = require('../model/EventModel');
const Bussiness = require('../model/BussinesModel');
const jwt = require('jsonwebtoken');
const moment = require('moment');


const upload = require('../config/upload');

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
        let token = jwt.sign({ id: client.id }, process.env.SECERT_KEY);
        return res.json({ success: true, user: 'client', token: 'JWT ' + token });
        // res.json({ success: true, msg: "u have been registerd", token: });
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
        (event1, event2) => {
            let [hours1, minutes1] = event1.startingTime.split(":");
            let [hours2, minutes2] = event2.startingTime.split(":");
            let m1 = moment(event1.date, "DD/MM/YYYY").set({ hours: hours1, minutes: minutes1 });;
            let m2 = moment(event2.date, "DD/MM/YYYY").set({ hours: hours2, minutes: minutes2 });;
            return m1 - m2;
        }
    )
    eventsSortedByDate = eventsSortedByDate.map(event => ({
        activityId: event.activityId,
        date: event.date,
        _id: event._id,
        startingTime: event.startingTime,
        workingDayId: event.workingDayId,
        status: event.status,
        name: event.bussinessId.name,
        address: event.bussinessId.address,
        email: event.bussinessId.email,
        phone: event.bussinessId.phone
    }));
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

Router.post('/rating/:bussinessId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let bussiness = await Bussiness.findOne({ _id: req.params.bussinessId });
    bussiness.ratingVote[req.body.rating] += 1;
    let ratingVote = bussiness.ratingVote.toObject();
    let sum = 0;
    let total = 0;
    for (let key in ratingVote) {
        if (ratingVote.hasOwnProperty(key)) {
            sum += Number(key) * ratingVote[key];
            total += ratingVote[key];
        }
    }
    let rating = sum / total;
    bussiness.rating = rating;
    let savedBussiness = await bussiness.save();
    res.send({ success: true, data: "seccsefully rated" });
})

module.exports = Router;