const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticationMiddleware = require('../../config/authentication')
let Strategy = require('passport-local').Strategy;

// Login route
router.get("/", (req, res) => {
    res.render("user/loginView/login", {
        pageTitle: "Login"
    });
});

// Login post. Using Passport to verify that the user is authenticated.
router.post("/", (req, res, next) => {

    // Getting the Recaptcha response
    var recaptchaResponse = req.body['g-recaptcha-response'];
    if (recaptchaResponse === undefined || recaptchaResponse === '' ||
        recaptchaResponse === null) {
        res.render("user/loginView/login", {
            error: "Please Select Captcha."
        })
    } else {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                res.render("user/loginView/login", {
                    pageTitle: "Error",
                    error: "An account with that email does not exist."
                })
            } else {
                if (user) {
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.redirect("/");
                    });
                } else {
                    res.render("user/loginView/login", {
                        pageTitle: "Error",
                        error: "Incorrect password."
                    })
                }
            }
        })(req, res, next);
    }
});

module.exports = router;