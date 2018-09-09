const express = require('express');
const Router = express.Router();
const Bussiness = require('../model/BussinesModel');
const passport = require('passport');
const moment = require('moment');
const Pusher = require('pusher');
const crypto = require("crypto");

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: 'ap2',
    encrypted: true
});

Router.get('/', async (req, res) => {
    try {
        let allbussiness = await Bussiness.find({});
        res.send({ success: true, bussiness: allbussiness });
    }
    catch (err) {
        res.send({ success: false, msg: `${err}` });
    }
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



Router.post('/update', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        req.check('name', 'name is required').notEmpty();
        req.check('phone', 'phone is not valid').isMobilePhone();
        req.check('phone', 'phone is required').notEmpty();
        req.check('category', 'category is required').notEmpty();
        req.check('email', 'email is not valid').isEmail();
        req.check('email', 'email is required').notEmpty();
        req.check('address', 'address is required').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            throw errors;
        }

        req.user.name = req.body.name;
        req.user.phone = req.body.phone;
        req.user.email = req.body.email;
        req.user.address = req.body.address;
        req.user.category = req.body.category;

        let bussiness = await req.user.save();
        res.json({ success: true, msg: "bussiness has been updated" });

    } catch (err) {
        res.json({ success: false, errors: err });
    }
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



Router.post('/register', async (req, res) => {
    try {
        req.check('name', 'name is required').notEmpty();
        req.check('phone', 'phone is required').notEmpty();
        req.check('category', 'category is required').notEmpty();
        req.check('email', 'email is required').notEmpty();
        req.check('password', 'password is required').notEmpty();
        req.check('address', 'address is required').notEmpty();
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
        let newBussiness = new Bussiness(req.body);
        let bussiness = await newBussiness.save()
        res.send({ success: true, msg: "u have been registerd.. you can login." });
    }
    catch (err) {
        res.json({ success: false, errors: err })
    }
});


Router.post('/isExists', async (req, res) => {
    try {
        req.check('email', 'email is not valid').isEmail();
        req.check('email', 'email is required').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            throw errors;
        }
        let bussiness = await Bussiness.findOne({ email: req.body.email });
        if (!bussiness) return res.send({ success: true, msg: "available" });
        return res.send({ success: false, msg: "not available" })
    } catch (err) {
        res.send({ success: false, msg: err[0].msg })
    }
})

Router.post('/calendar', passport.authenticate('jwt', { session: false }), (req, res) => {
    let promises = [];

    for (let i = 0; i < req.body.length; i++) {
        // console.log(req.body[i].date);
        let day = {
            date: req.body[i].date,
            timeDuration: {
                timeStart: req.body[i].timeStart,
                timeEnd: req.body[i].timeEnd
            }
        };
        promises.push(day);
    }
    req.user.workingDays = req.user.workingDays.concat(...promises);
    req.user.save()
        .then(bussiness => res.send({ success: true, msg: "your wark days has been saved." }))
        .catch(err => res.send({ success: false, msg: "Somtehing went wrong, plesae try again" }))
});

Router.get('/calendar', passport.authenticate('jwt', { session: false }), (req, res) => {
    let events = req.user.workingDays.reduce(function (accumulator, currentValue) {
        return [...accumulator, ...currentValue.events];
    }, []);
    res.send({ success: true, events: events })
});

// this is a innerjoin with 2 arrays
const equijoin = (xs, ys, primary, foreign, sel) => {
    const ix = xs.reduce((ix, row) => ix.set(row[primary], row), new Map);
    return ys.map(row => sel(ix.get(row[foreign]), row));
};

Router.get('/clients', passport.authenticate('jwt', { session: false }), (req, res) => {
    // get the featured working days that have a events
    let now = moment().format("DD/MM/YYYY");
    let workingDays = req.user.workingDays.filter(workDay => {
        let workDayDate = moment(workDay.date, "DD/MM/YYYY");
        return workDay.events.length === 0 || now > workDayDate ? false : true;
    });
    let events = workingDays.reduce((arr, curr) => [...arr, ...curr.events], []);
    if (events.length === 0) return res.send({ success: true, clients: [] });
    let clientsWithEvent = req.user.clients.map(client => {
        let obj = {};

        let matchEvents = equijoin(events, client.events,
            "id",
            "id",
            ({ _id, startingTime, date }, { status }) => ({ _id, startingTime, date, status }));
        if (matchEvents.length === 0) return null;

        let todayEvent = matchEvents.find(e => e.date === now);

        return obj = {
            _id: client._id,
            name: client.name,
            phone: client.phone,
            avatarUrl: client.avatarUrl,
            email: client.email,
            events: matchEvents.length,
            todayEvent: todayEvent ? true : false
        }

    })
    // map eatch clients to see if the events is
    res.send({ success: true, clients: clientsWithEvent })

});

Router.get('/search/:search', async (req, res) => {
    let search = req.params.search;
    let exp = new RegExp(search, 'i');
    let business = await Bussiness.find({}).populate({ path: 'workingDays.events activites', populate: { path: "activityId", model: "activity" } });
    if (business.length === 0) {
        res.send({ success: true, filter: business })
    }
    else {
        let filter = business.filter(item => exp.test(item.name) && item.workingDays.length > 0);
        res.send({ success: true, filter });
    }
})


Router.get('/:bussinessId/activity/:activityId/events', async (req, res) => {
    let bussinessId = req.params.bussinessId;
    let activityId = req.params.activityId;
    let filter = await Bussiness.findOne({ _id: bussinessId }).populate({ path: 'activites workingDays.events', populate: { path: 'activityId', model: 'activity' } });

    filter.workingDays = filter.workingDays.filter(days => {
        let moment1 = days.date;
        let moment2 = moment().format("DD/MM/YYYY");
        return moment1 >= moment2;
    })
    filter.workingDays = filter.workingDays.slice(0, 5);
    let activity = filter.activites.find(item => item.id === activityId);
    let activityDuration = activity.duration;

    filter.workingDays.forEach(workDay => {
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
        let times = [];
        // first we added the regular times from the activity
        for (let time = timeStart; time <= timeEnd; time.add(activityDuration, 'minutes')) {
            times.push(time.format("HH:mm"));
        }
        let needToSort = false;
        // then we added the end time of each event
        for (let i = 0; i < events.length; i++) {
            let found = times.find(item => item === events[i].timeEnd);
            if (!found) {
                needToSort = true;
                times.push(events[i].timeEnd);
            }
        }
        // sort the array of times in order
        if (needToSort) {
            times.sort((time1, time2) => moment(time2, "HH:mm") < moment(time1, "HH:mm"));
        }
        // we loop through our times and continue regular
        for (let i = 0; i < times.length; i++) {
            let time = moment(times[i], "HH:mm");
            let timeToEnd = time.clone().add(activityDuration, 'minutes');
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

            // check if TimeToEnd is less then the TimeEnd
            if (timeToEnd > timeEnd) {
                shuldBeAdded = false;
            }

            // check if shuldbeAdded is true
            if (shuldBeAdded) {
                const _id = crypto.randomBytes(16).toString("hex");
                opendEvents.push({ _id: _id, timeStart: time.format("HH:mm"), timeEnd: timeToEnd.format("HH:mm") })
            }

        }
        workDay.opendEvents = opendEvents;
    })

    filter.workingDays = filter.workingDays.filter(workDay => {
        return workDay.opendEvents.length > 0;
    })
    let events = filter.workingDays.reduce((arr, curr) => [...arr, ...curr.opendEvents], []);
    if (events.length === 0) return res.send({ success: true, workingDays: [] });

    workingDays = filter.workingDays.map(workDay => ({
        _id: workDay.id,
        opendEvents: workDay.opendEvents,
        date: workDay.date
    }))
    pusher.trigger('bussiness', 'get-events', {
        workingDays: workingDays,
        activityId: activityId
    })
    res.send({ success: true, workingDays: workingDays });
})


module.exports = Router;