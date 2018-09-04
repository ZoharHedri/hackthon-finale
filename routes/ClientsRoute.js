const express = require('express');
const Router = express.Router();
const passport = require('passport');
const Client = require('../model/ClientsModel');
const Event = require('../model/EventModel');
const Bussiness = require('../model/BussinesModel');
const WorkDay = require('../model/WorkDayModel');

Router.post('/register', (req, res) => {
    req.check('name', 'name is required').notEmpty();
    req.check('phone', 'phone is not valid').isMobilePhone();
    req.check('phone', 'phone is required').notEmpty();
    req.check('email', 'email is not valid').isEmail();
    req.check('email', 'email is required').notEmpty();
    req.check('password', 'password is required').notEmpty();
    req.checkBody('confirmPassword', "password don't match").equals(req.body.password);
    let errors = req.validationErrors();
    if (errors) {
        errors = errors.reduce((arr, curr) => {
            arr.push(curr.msg);
            return arr;
        }, []);
        return res.send({ success: false, errors: errors });
    }
    req.body.avatarUrl = req.file.filename;
    let newClient = new Client(req.body);
    newClient.save()
        .then(Client => res.json({ success: true, msg: "u have been registerd" }))
        .catch(err => res.json({ success: false, msg: "please try again" }))
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
//})



Router.delete('/event/:eventId', passport.authenticate('jwt', { session: false }), (req, res) => {
    let eventId = req.params.eventId;
    let evenets = req.user.events;
    let index = evenets.findIndex(item => item.id === eventId)
    evenets.splice(index, 1);
    req.user.events = evenets;
    // delete the event allso from the workDay
    Bussiness.find({})
        .then(bussiness => {
            let findWorkDay = bussiness.find(item => {
                item.workingDays.find(work => {
                    let index = work.events.findIndex(event => event.id === events);
                    if (index !== -1) {
                        work.events.splice(index, 1);
                        return true;
                    }
                })
            })
        })
    WorkDay.updateOne({ events: eventId }, { $pull: { events: eventId } })
        .then(workDayRes => {
            // if the user dosent have events then we need to delete it from all the bussiness client
            if (evenets.length === 0) {
                Bussiness.updateMany({ clients: req.user._id }, { $pull: { clients: req.user._id } })
                    .then(result => {
                        req.user.save()
                            .then(user => res.send({ success: true, msg: "event deleted" }))
                            .catch(err => res.send({ success: false, msg: "something went worng please try again" }));
                    })
            } else {
                req.user.save()
                    .then(user => res.send({ success: true, msg: "event deleted" }))
                    .catch(err => res.send({ success: false, msg: "something went worng please try again" }));
            }
        })
})
module.exports = Router;