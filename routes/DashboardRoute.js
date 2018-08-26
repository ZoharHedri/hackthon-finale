
const express = require('express');
const Router = express.Router();
const passport = require('passport');
const Bussiness = require('../model/BussinesModel'); //get the bussines data from the DB (BussinesModel)

//jwt = Json Web Token, for authentication
//'passport.authenticate' go to mongoDB and find the user with that TOKEN and put the user on the 'req' parameter 
Router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    //1. check what i have in req!
    //2. if (req.user.id)...{
        res.send({ success: true, details: req });
    //}
    
    //.catch(err => res.send({ success: false, msg: `${err}` }));
})

module.exports=Router;