
const express = require('express');
const Router = express.Router();
const passport = require('passport');
const moment = require ('moment');
// const Bussiness = require('../model/BussinesModel'); //get the bussines data from the DB (BussinesModel)

//jwt = Json Web Token, for authentication
//'passport.authenticate' go to mongoDB and find the user with that TOKEN and put the user on the 'req' parameter 
Router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {


    // let det = { activites: req.user.activites, address: req.user.address, category: req.user.category,
    //     clients: req.user.clients, email: req.user.email ,name: req.user.name,
    //     phone: req.user.phone, workingDays: req.user.workingDays }
    // console.log(` without password/n ${det}`);
    // console.log(req.user); //good
    // console.log(object)
    let arrWork = req.user.workingDays;
    let events = [];
    
    let now = moment().format("YY-MM-DD")
    //console.log(now);
    
    for (let i = 0; i < arrWork.length; i++){
        console.log(arrWork[i].date);
        let day = moment(arrWork[i].date).format("YY-MM-DD");
        //console.log(day);
        if(now === day){
            events = arrWork[i].events;
            console.log(events);
            break;
        }
    }    

    res.send({
        success: true,
        details: { activites: req.user.activites, address: req.user.address, category: req.user.category,
            clients: req.user.clients, email: req.user.email ,name: req.user.name,
            phone: req.user.phone, eventsDay: events }
        });

    
    //}

    //.catch(err => res.send({ success: false, msg: `${err}` }));
})

module.exports = Router;