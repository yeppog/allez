const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectID;
// const config = require('./../../../config')

// Validate inputs


// User model
const User = require("../../models/User");



/**
 * Handles the POST request of creating a new account.
 * 
 * Firstly checks if a user account of given email already exists. Then hashes the password and finally sends a POST request through save()
 * 
 * TODO: implement JWT token
 * TODO: implement account validation
 * 
 * @param {object} req Takes in a request with a body that should contain a Username, Email and Password
 * @param {object} res Server response
 */
function handleRegister(req, res) {
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
 * Asynchronus function that validates a user to login. Compares the provided credentials to the database credentials.
 * 
 * @param {object} req The credentials to be validated.
 * @param {object} res The response from the server
 * @returns A specified response for the different HTTP status to be issued. Returns a JWT token to be stored by the client.
 * HTTP 400: Incomplete credentials
 * HTTP 401: Invalid credentials
 * HTTP 500: Any other error
 * HTTP 200: OK
 */

async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "Not all fields have been entered."})
        } else {
            const user = await User.findOne({ email: email});
            if (!user) {
                return res.status(401).json({message:" Invalid user"})
            } 
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(401).json({message: "Invalid credentials"});
            }
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    username: user.username
                }
            });
        }
    } catch(err) {
        return res.status(500).json({ error: err.message });
    };
}

/**
 * Checks the JWT token given in the header to see if it is a valid JWT token and if it has expired.
 * If the JWT token is valid, return essential user credentials to the client.
 * 
 * @param {object} req Contains "auth-token" in the header with the JWT token 
 * @param {object} res Returns a JSON with the user credentials if valid, else server response
 * @returns Returns HTTP code with a server response
 * HTTP 400: No token specified
 * HTTP 401: Token is not valid
 * HTTP 403: Error finding user
 */

async function handleVerify(req, res) {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(400).json({message: "No token"});
    } else {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({message: "Failed"});
        } else {
            // decoding the token returns us our objectId that we encoded
            const userId =  jwt.decode(token, process.env.JWT_SECRET).id;
            let user;
            try {
                user = await User.findOne(new ObjectId(userId));
            } catch (err) {
                // return error if we somehow encounter an error finding the user
                return res.status(403).json(err);
            }
            // Return specific fields (to not return password hash)
            return res.json({
                username: user.username,
                email: user.email
            });
        }
    }   
}


/** Provides the route for the API at ./register using the handleRegister function. */
router.post("/register", handleRegister);

/** Provides the route for the API at ./login using the handleLogin function */
router.post("/login", handleLogin);

/** Provides the route for the API at ./check, verifies the JWT token for relogins */
router.post("/verify", handleVerify);


module.exports = router;