const express = require('express');
const Router = express.Router();
const Bussiness = require('../model/BussinesModel');

Router.get('/', (req, res) => {
    let newBussiness = new Bussiness({
        name: "Salon Yofi",
        phone: "054-22345782",
        email: "example@gmail.com",
        password: "123",
        address: "123 street"
    })
    newBussiness.save(business => res.send(business));
})

Router.post('/register', (req, res) => {
    let newBussiness = new Bussiness(req.body);
    newBussiness.save()
        .then(bussiness => res.json({ success: true, msg: "u have been registerd.. you can login." }))
        .catch(err => res.json({ success: false, msg: "please try again" }))
})

module.exports = Router;