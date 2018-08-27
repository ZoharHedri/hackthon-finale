const express = require('express');
const Router = express.Router();
const Bussiness = require('../model/BussinesModel');
const Client = require('../model/ClientsModel');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const nodemailer = require('nodemailer');

Router.get('/', (req, res) => {
    Bussiness.find({})
        .then(allbussiness => {
            res.send({ success: true, bussiness: allbussiness });
        })
        .catch(err => res.send({ success: false, msg: `${err}` }));
})

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


Router.get('/clients', passport.authenticate('jwt', { session: false }), (req, res) => {
    Bussiness.findOne({ _id: req.user.id }, { clients: 1, _id: -1 }).populate('clients').exec()
        .then(b => {
            res.send({ success: true, clients: b.clients })
        })
        .catch(err => res.send({ success: false, msg: `${err}` }));
});

// a simple test route to see if authentication works
Router.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ success: true, msg: "it worked" });
})


module.exports = Router;