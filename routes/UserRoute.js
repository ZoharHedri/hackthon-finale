const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const nodemailer = require('nodemailer');
const Bussiness = require('../model/BussinesModel');
const Client = require('../model/ClientsModel');
const passport = require("passport");

// if a user can login then we can send him a token
Router.post('/login', (req, res) => {
    Bussiness.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // cheking if the email is belong to the client's in clients model
                Client.findOne({ email: req.body.email })
                    .then(client => {
                        if (!client) return res.json({ success: false, msg: "Invalid Username or Password" });
                        if (client.password === req.body.password) {
                            let token = jwt.sign({ id: client.id }, process.env.SECERT_KEY);
                            return res.json({ success: true, user: 'client', token: 'JWT ' + token })
                        } else {
                            return res.json({ success: false, msg: "Invalid Username or Password" });
                        }
                    })
                    .catch(err => res.send({ success: false, msg: `${err}` }));
                return;
            }
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // we creating the token
                    let token = jwt.sign({ id: user.id }, process.env.SECERT_KEY);
                    return res.json({ success: true, user: 'business', token: 'JWT ' + token })
                }
                return res.json({ success: false, msg: "Invalid Username or Password" });
            })
        })
        .catch(err => res.json({ success: false, msg: `Something went wrong, please try again` }));
})



Router.post('/password/forgot', (req, res) => {
    req.check('email', 'Email is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        errors = errors.reduce((arr, curr) => {
            arr.push(curr.msg);
            return arr;
        }, [])
        return res.status(400).send({ success: false, errors: errors });
    }
    Bussiness.findOne({ email: req.body.email })
        .then(bussiness => {
            if (!bussiness) {
                Client.findOne({ email: req.body.email })
                    .then(client => {
                        if (!client) {
                            res.send({ success: false, msg: "email address doesn't exist" });
                        } else {
                            sendMail(client.name, client.email)
                                .then(() => res.send({ success: true, msg: "Please check your email for further instructions" }))
                                .catch(err => res.send({ success: false, msg: `Something went wrong, please try again` }))
                        }
                    })
                    .catch(err => res.send({ success: false, msg: "Something went wrong, please try again" }))
            } else {
                sendMail(bussiness.name, bussiness.email)
                    .then(() => res.send({ success: true, msg: "Please check your email for further instructions" }))
                    .catch(err => res.send({ success: false, msg: `Something went wrong, please try again` }))
            }
        })
        .catch(err => res.send({ success: false, msg: `Something went wrong, please try again` }))
})

Router.post('/password/reset/:token', (req, res) => {
    try {
        let token = req.params.token;
        let data = jwt.verify(token, process.env.SECERT_KEY);
        // search the email in bussiness or clients array's
        Bussiness.findOne({ email: data.email })
            .then(bussiness => {
                if (!bussiness) {
                    Client.findOne({ email: data.email })
                        .then(client => {
                            if (!client) {
                                return res.send({ success: false, msg: "email address is not found!" })
                            } else {
                                client.password = req.body.password;
                                client.save()
                                    .then(savedClient => {
                                        res.send({ success: true, msg: "your password has been changed.." })
                                    })
                                    .catch(err => res.send({ success: false, msg: `${err}` }));
                            }
                        })
                } else {
                    bussiness.password = req.body.password;
                    bussiness.save()
                        .then(savedBussiness => {
                            res.send({ success: true, msg: "your password has been changed.." })
                        })
                        .catch(err => res.send({ success: false, msg: `${err}` }));
                }
            })
            .catch(err => res.send({ success: false, msg: `${err}` }));
    }
    catch (err) {
        re.send({ success: false, msg: `Invalid or expired token` });
    }
})

Router.get('/automaticLogin', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send({ success: true, msg: "successfuly logged in", user: req.user.constructor.modelName })
})

// send mail
function sendMail(name, email) {
    // creating a token that expires after 1h
    let token = jwt.sign({ email: email }, process.env.SECERT_KEY, { expiresIn: '1h' });
    let URL = `https://evening-bayou-28934.herokuapp.com/password/reset/${token}`;
    // create the mailer SERVICE
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            type: "OAuth2",
            user: process.env.GMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    let html = `
        <html>
            <head>
            <style>
                @import url("https://fonts.googleapis.com/css?family=Roboto:300,400,700");
                @import url("https://necolas.github.io/normalize.css/8.0.0/normalize.css");
                *,
                *::before,
                *::after{
                    box-sizing: inherit;
                }
                body{
                font-family:Roboto, sans-serif;
                box-sizing: border-box;
                }
                
                .container{
                margin: 80px auto;
                padding:10px 20px;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                border:1px solid rgba(0,0,0,.2);
                box-shadow:0 10px 15px rgba(0,0,0,.14);
                border-radius: 5px;
                }
                
                h1{
                color:#333;
                font-weight:700;
                font-family:'Segoe UI',sans-serif;
                }
                p{
                color:#777;
                }
                
                .reset{
                padding:10px 15px;
                border:1px solid #dfdfdf;
                border-radius:3px;
                background:linear-gradient(to bottom, #74b9ff, #0984e3);
                cursor:pointer;
                color:white;
                text-decoration:none;
                }
                .reset:visited{
                    color:white;
                }
                .reset:hover{
                background:linear-gradient(to bottom, #0984e3, #74b9ff);
                }
                .trouble{
                font-size: .8rem;
                }
                a{
                    margin-bottom:16px;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <h1>Hi <span>${name}</span>,</h1>
                <p>You recently requested to reset your password for your account.</p>
                <p>click the button below to reset it.</p>
                
                <a class="reset" href=${URL}>Reset Your Password</a>
                
                <p>if you did not request a password reset, please ignore this email, or replay to let us know.This password reset is only valid for the next hour.</p>
                
                <p class="trouble">if you are having trouble clicking the password reset button, copy and paste the URL below into your web browser.</p>
                <br/>

                <span style="margin-bottom:16px;">
                ${URL}
                </span>
                
                <p>Thanks,<br/>Nagasa, and Bussiness Team</p>
                
                </div>
            </body>
        </html>`;

    let mailOptions = {
        from: `Bussiness Team <${process.env.GMAIL_USER}>`,
        to: `${email}`,
        subject: 'Password Reset',
        html: html
    }
    return transporter.sendMail(mailOptions);
}

module.exports = Router;