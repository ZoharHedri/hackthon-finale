
const express = require('express');
const Router = express.Router();
const passport = require('passport');
const moment = require('moment');

Router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    let arrWork = req.user.workingDays;
    let events = [];

    let now = moment().format("DD/MM/YYYY");

    for (let i = 0; i < arrWork.length; i++) {
        let day = arrWork[i].date;
        if (now === day) {
            events = arrWork[i].events;
            break;
        }
    }

    res.send({
        success: true,
        details: {
            activites: req.user.activites, address: req.user.address, category: req.user.category,
            clients: req.user.clients, email: req.user.email, name: req.user.name,
            phone: req.user.phone, eventsDay: events
        }
    });
})

module.exports = Router;