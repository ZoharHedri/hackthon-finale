
const express = require('express');
const Router = express.Router();
const passport = require('passport');
// const Bussiness = require('../model/BussinesModel'); //get the bussines data from the DB (BussinesModel)

//jwt = Json Web Token, for authentication
//'passport.authenticate' go to mongoDB and find the user with that TOKEN and put the user on the 'req' parameter 
Router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    
    //activites & clients(?) & _id & name & phone & category & email & address & workingDays

    // let det = { activites: req.user.activites, address: req.user.address, category: req.user.category,
    //     clients: req.user.clients, email: req.user.email ,name: req.user.name,
    //     phone: req.user.phone, workingDays: req.user.workingDays }
    // console.log(` without password/n ${det}`);
    console.log(req.user);

    res.send({ 
        success: true, 
        details: { activites: req.user.activites, address: req.user.address, category: req.user.category,
             clients: req.user.clients, email: req.user.email ,name: req.user.name,
             phone: req.user.phone, workingDays: req.user.workingDays } 
        });
    //}

    //.catch(err => res.send({ success: false, msg: `${err}` }));
})

module.exports = Router;