const express = require('express');
const Router = express.Router();
const Bussiness = require('../model/BussinesModel');
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
    let newBussiness = new Bussiness(req.body);
    newBussiness.save()
        .then(bussiness => res.json({ success: true, msg: "u have been registerd.. you can login." }))
        .catch(err => res.json({ success: false, msg: "please try again" }))
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

Router.post('/forgot-password', (req, res) => {
    Bussiness.findOne({ email: req.body.email })
        .then(bussiness => {
            if (!bussiness) {
                res.send({ success: false, msg: "emil address not found!." });
            }
            // creating a token that expires after 1h
            let token = jwt.sign({ email: req.body.email }, process.env.SECERT_KEY, { expiresIn: '1h' });
            let URL = `http://localhost:3000/reset-password/${token}`;
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
                            <h1>Hi <span>${bussiness.name}</span>,</h1>
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
                to: `${req.body.email}`,
                subject: 'Password Reset',
                html: html
            }

            transporter.sendMail(mailOptions)
                .then(() => res.send({ success: true, msg: "mail has been sent, please check you email inbox" }))
                .catch(err => res.send({ success: false, msg: `${err}` }))

        })
        .catch(err => res.send({ success: false, msg: `${err}` }))
})

Router.post('/reset-password/:token', (req, res) => {
    try {
        let token = req.params.token;
        let data = jwt.verify(token, process.env.SECERT_KEY);
        // search the email in bussiness or clients array's
        Bussiness.findOne({ email: data.email })
            .then(bussiness => {
                if (!bussiness) {
                    return res.send({ success: false, msg: "email address is not found!" })
                }
                bussiness.password = req.body.password;
                bussiness.save()
                    .then(savedBussiness => {
                        res.send({ success: true, msg: "your password has been changed.." })
                    })
                    .catch(err => res.send({ success: false, msg: `${err}` }));
            })
            .catch(err => res.send({ success: false, msg: `${err}` }));
    }
    catch (err) {
        re.send({ success: false, msg: `${err}` });
    }
})

module.exports = Router;