const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Validate inputs


// User model
const User = require("../../models/User");



/**
 * Handles the POST request of creating a new account.
 * 
 * Firstly checks if a user account of given email already exists. Then hashes the password and finally sends a POST request through save()
 * 
 * TODO: implement JWT token
 * 
 * @param {object} req Takes in a request with a body that should contain a Username, Email and Password
 * @param {object} res Server response
 */
function requestHandler(req, res) {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            bcrypt.genSalt().then(salt => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    })
}

/**
 * Provides the route for the API at ./register using the requestHandler function.
 */

router.post("/register", requestHandler);


module.exports = router;