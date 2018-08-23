const express = require('express');
const Router = express.Router();
const Bussiness = require('../model/BussinesModel');
const Client = require('../model/ClientsModel');
const jwt = require('jsonwebtoken');
const passport = require('passport');

Router.get('/', (req, res) => {
    Bussiness.find({})
        .then(allbussiness => {
            res.send({ success: true, bussiness: allbussiness });
        })
        .catch(err => res.send({ success: false, msg: `${err}` }));
})

Router.post('/register', (req, res) => {
    let newBussiness = new Bussiness(req.body);
    newBussiness.save()
        .then(bussiness => res.json({ success: true, msg: "u have been registerd.. you can login." }))
        .catch(err => res.json({ success: false, msg: "please try again" }))
});


Router.post('/client', (req, res) => {
    let newClient = new Client(req.body);
    newClient.save()
        .then(Client => res.json({ success: true, msg: "u have been registerd" }))
        .catch(err => res.json({ success: false, msg: "please try again" }))
});

Router.get('/clients',passport.authenticate('jwt', { session: false }), (req, res) => {
    Bussiness.findOne({_id:req.user.id},{clients:1, _id:-1}).populate('clients').exec()
    .then(b => {
        res.send({success:true, clients:b.clients})
    })
    .catch(err => res.send({success:false, msg:`${err}`}));
});





// if a user can login then we can send him a token
Router.post('/login', (req, res) => {
    Bussiness.findOne({ email: req.body.email })
        .then(user => {
            if (!user) return res.json({ success: false, msg: "email address cannot be found!" });
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // we creating the token
                    let token = jwt.sign({ id: user.id }, process.env.SECERT_KEY, { expiresIn: '1h' });
                    return res.json({ success: true, token: 'JWT ' + token })
                }
                return res.json({ success: false, msg: "passpword dont match..." });
            })
        })
        .catch(err => res.json({ success: false, msg: `${err}` }));
})

// a simple test route to see if authentication works
Router.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ success: true, msg: "it worked" });
})

module.exports = Router;