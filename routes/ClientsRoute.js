const express = require('express');
const Router = express.Router();
const passport = require('passport');
const Client = require('../model/ClientsModel');
const Event = require('../model/EventModel');

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
    res.send({ success: true, events: eventsSortedByDate });
})

Router.delete('/event/:eventId', passport.authenticate('jwt', { session: false }), (req, res) => {
    let eventId = req.params.eventId;
    let evenets = req.user.events;
    let index = evenets.findIndex(item => item.id === eventId)
    evenets.splice(index, 1);
    req.user.events = evenets;
    req.user.save()
        .then(user => res.send({ success: true, msg: "event deleted" }))
        .catch(err => res.send({ success: false, msg: "something went worng please try again" }));
})
module.exports = Router;