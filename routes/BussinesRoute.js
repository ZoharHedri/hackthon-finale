const express = require('express');
const Router = express.Router();
const Bussiness = require('../model/BussinesModel');
const Client = require('../model/ClientsModel');
const WorkDay = require('../model/WorkDayModel');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const nodemailer = require('nodemailer');
const moment = require('moment');

Router.get('/', (req, res) => {
    Bussiness.find({})
        .then(allbussiness => {
            res.send({ success: true, bussiness: allbussiness });
        })
        .catch(err => res.send({ success: false, msg: `${err}` }));
})

Router.get('/setting', passport.authenticate("jwt", { session: false }), (req, res) => {
    let info = {
        name: req.user.name,
        phone: req.user.phone,
        email: req.user.email,
        address: req.user.address,
        category: req.user.category,
        oldPassword: "",
        password: "",
        confirmPassword: ""
    }
    res.send({ success: true, info: info });
})



Router.post('/update', passport.authenticate("jwt", { session: false }), (req, res) => {
    // check if body is valid
    req.check('name', 'name is required').notEmpty();
    req.check('phone', 'phone is not valid').isMobilePhone();
    req.check('phone', 'phone is required').notEmpty();
    req.check('category', 'category is required').notEmpty();
    req.check('email', 'email is not valid').isEmail();
    req.check('email', 'email is required').notEmpty();
    req.check('address', 'address is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        errors = errors.reduce((arr, curr) => {
            arr.push(curr.msg);
            return arr;
        }, []);
        return res.send({ success: false, errors: errors });
    }

    // save to database
    req.user.name = req.body.name;
    req.user.phone = req.body.phone;
    req.user.email = req.body.email;
    req.user.address = req.body.address;
    req.user.category = req.body.category;

    req.user.save()
        .then(bussiness => res.json({ success: true, msg: "bussiness has been updated" }))
        .catch(err => res.json({ success: false, msg: "please try again" }))
});



Router.post('/updatePassword', passport.authenticate("jwt", { session: false }), (req, res) => {
    // check if body is valid
    req.check('password', 'password is required').notEmpty();
    req.check('oldPassword', 'old Password is required to change it').notEmpty();
    req.checkBody('confirmPassword', `password don't match`).equals(req.body.password);
    let errors = req.validationErrors();
    if (errors) {
        errors = errors.reduce((arr, curr) => {
            arr.push(curr.msg);
            return arr;
        }, []);
        return res.send({ success: false, errors: errors });
    }

    // check if old passport matches the saved password
    req.user.comparePassword(req.body.oldPassword, function (err, match) {
        if (!err && match) {
            // save to database
            req.user.password = req.body.password;
            req.user.save()
                .then(bussiness => res.json({ success: true, msg: "password has been updated" }))
                .catch(err => res.json({ success: false, msg: "please try again" }))
        } else {
            res.send({ success: false, msg: "your old password doesnt match" });
        }
    })


});



Router.post('/register', (req, res) => {
    // check if body is valid
    req.check('name', 'name is required').notEmpty();
    req.check('phone', 'phone is not valid').isMobilePhone();
    req.check('phone', 'phone is required').notEmpty();
    req.check('category', 'category is required').notEmpty();
    req.check('email', 'email is not valid').isEmail();
    req.check('email', 'email is required').notEmpty();
    req.check('password', 'password is required').notEmpty();
    req.checkBody('confirmPassword', "password don't match").equals(req.body.password);
    req.check('address', 'address is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        errors = errors.reduce((arr, curr) => {
            arr.push(curr.msg);
            return arr;
        }, []);
        return res.send({ success: false, errors: errors });
    }

    // save to database
    let newBussiness = new Bussiness(req.body);
    newBussiness.save()
        .then(bussiness => res.json({ success: true, msg: "u have been registerd.. you can login." }))
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
    Bussiness.findOne({ email: req.body.email })
        .then(bussiness => {
            if (!bussiness) {
                return res.send({ success: true, msg: "available" });
            }
            else {
                return res.send({ success: false, msg: "not available" })
            }
        })
        .catch(err => { throw err; })
})

Router.post('/calendar', passport.authenticate('jwt', { session: false }), (req, res) => {
    let promises = [];

    for (let i = 0; i < req.body.length; i++) {
        // console.log(req.body[i].date);
        let day = new WorkDay({
            date: req.body[i].date,
            timeDuration: {
                timeStart: req.body[i].timeStart,
                timeEnd: req.body[i].timeEnd
            }
        })
        let promise = day.save()
        promises.push(promise);
    }

    Promise.all(promises).then(values => {
        let ids = values.map(item => item._id);
        req.user.workingDays = req.user.workingDays.concat(ids);
        req.user.save()
            .then(bussiness => res.send({ success: true, msg: "your wark days has been saved." }))
            .catch(err => res.send({ success: false, msg: "Somtehing went wrong, plesae try again" }))

    })
});

Router.get('/calendar', passport.authenticate('jwt', { session: false }), (req, res) => {
    let events = req.user.workingDays.reduce(function (accumulator, currentValue) {
        return [...accumulator, ...currentValue.events];
    }, []);
    res.send({ success: true, events: events })
});

Router.get('/clients', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({ success: true, clients: req.user.clients })

});

// a simple test route to see if authentication works
Router.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ success: true, msg: "it worked" });
})

Router.get('/search/:search', (req, res) => {
    let search = req.params.search;
    let exp = new RegExp(search, 'i');
    Bussiness.find({}).populate({
        path: 'workingDays activites',
        populate: {
            path: "events",
            model: "event",
            populate: {
                path: "activityId",
                model: "activity"
            }
        }
    })
        .then(business => {
            if (business.length === 0) {
                res.send({ success: true, filter: business })
            }
            else {
                let filter = business.filter(
                    item => {
                        return exp.test(item.name) && item.workingDays.length > 0;
                    }
                )

                filter.forEach(item => {
                    item.workingDays = item.workingDays.filter(days => {
                        let moment1 = moment(days.date);
                        let moment2 = moment();
                        let diff = moment1.diff(moment2, 'days');
                        return diff <= 6;
                    })

                    // we find the longest activity duration
                    let activites = item.activites.map(item => item.duration);
                    let longActivityDuration = Math.max.apply(Math, activites);

                    item.workingDays.forEach(workDay => {
                        let opendEvents = [];

                        let events = workDay.events.reduce((arr, curr) => {
                            let time = moment().toDate();
                            let hours = Number(curr.startingTime.split(":")[0]);
                            let minutes = Number(curr.startingTime.split(":")[1]);
                            time.setHours(hours);
                            time.setMinutes(minutes);
                            time.setSeconds(0);
                            time = moment(time);
                            time.add(curr.activityId.duration, 'minutes');
                            time = time.format("HH:mm");
                            return [...arr, { timeStart: curr.startingTime, timeEnd: time }]
                        }, []);

                        events.push(...workDay.breaking);

                        events.sort((e1, e2) => {
                            let time1 = moment(e1.timeStart, "HH:mm");
                            let time2 = moment(e2.timeStart, "HH:mm");
                            return time2.isBefore(time1);
                        });
                        let timeStart = moment(workDay.timeDuration.timeStart, "HH:mm");
                        let timeEnd = moment(workDay.timeDuration.timeEnd, "HH:mm");
                        for (let time = timeStart; time <= timeEnd; time.add(longActivityDuration, 'minutes')) {
                            let timeToEnd = time.clone().add(longActivityDuration, 'minutes');
                            let shuldBeAdded = true;
                            // check if the time to be added is allredy in the events array
                            for (let i = 0; i < events.length; i++) {
                                let timeEventStart = moment(events[i].timeStart, "HH:mm");
                                let timeEventEnd = moment(events[i].timeEnd, "HH:mm");
                                if (time > timeEventStart && time < timeEventEnd) {
                                    shuldBeAdded = false;
                                    break;
                                } else if (time <= timeEventStart && timeToEnd > timeEventStart) {
                                    shuldBeAdded = false;
                                    break;
                                }

                            }

                            // check if shuldbeAdded is true
                            if (shuldBeAdded) {
                                opendEvents.push(time.format("HH:mm"))
                            }


                        }

                        workDay.opendEvents = opendEvents;

                    })

                })

                filter = filter.map(item => {
                    item.workingDays = item.workingDays.filter(workDay => workDay.opendEvents.length > 0)
                    return item;
                })

                let newArray = filter.map(item => (
                    {
                        _id: item.id,
                        name: item.name,
                        activites: item.activites,
                        workingDays: item.workingDays.map(workDay => ({
                            _id: workDay.id,
                            opendEvents: workDay.opendEvents,
                            date: workDay.date
                        }))
                    }));

                res.send({ success: true, filter: newArray });
            }

        })

})


module.exports = Router;