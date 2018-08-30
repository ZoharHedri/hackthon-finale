const express = require('express');
const Router = express.Router();
const Activity = require('../model/ActivtyModel');
const passport = require('passport');

Router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    let allActivities = req.user.activites;
    res.send({ success: true, activites: allActivities })
})

Router.post('/addActivity', passport.authenticate('jwt', { session: false }), (req, res) => {
    let newActivity = new Activity(req.body)
    newActivity.save()
        .then(activity => {
            req.user.activites = req.user.activites.concat(activity.id);
            req.user.save()
                .then(user => res.json({ success: true, msg: "activity added" }))
                .catch(err => res.json({ success: true, msg: `${err}` }))
        })
        .catch(err => res.json({ success: true, msg: `${err}` }))
})

module.exports = Router;