/**
 * @swagger
 * components:
 *  schemas:
 *      LoginCredentials:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The email of the account being logged on to.
 *              password:
 *                  type: string
 *                  description: The password of the account being logged on to.
 *      RegisterCredentials:
 *          type: object
 *          required:
 *              - username
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The email of the account to be created with.
 *              password:
 *                  type: string
 *                  description: The password of the account to be created with.
 *              username:
 *                  type: string
 *                  description: The username of the account to be created with.
 * 
 * 
 * 
 * 
 * 
 */



const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/** Used to query by ObjectId */
const ObjectId = require("mongodb").ObjectID;

/** Automailer */
const nodemailer = require("nodemailer");

/** SMTP configuration. TODO: Store real credentials in env */
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        // spoof credentials from ethereal
        // can login from here to access the emails https://ethereal.email/
        user: "malinda66@ethereal.email",
        pass: "mg36XzUWRXTvGN1GGG"
    }
});


// Validate inputs


// User model
const User = require("../../models/User");



/**
 * Handles the POST request of creating a new account.
 * 
 * Firstly checks if a user account of given email already exists. Then hashes the password and finally sends a POST request through save()
 * 
 * 
 * @param {object} req Takes in a request with a body that should contain a Username, Email and Password
 * @param {object} res Server response
 */
async function handleRegister(req, res) {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            // TODO: Insert validator? maybe
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                activated: false,
            });

            bcrypt.genSalt().then(salt => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        return res.status(400).json(err)
                    };
                    newUser.password = hash;
                    let id;
                    newUser
                        .save()
                        .then(async user => {
                            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
                            // sends token to the registered email for confirmation;
                            await transporter.sendMail({
                                from: '"Allez" <reset@allez.com>',
                                to: `${newUser.email}`,
                                subject: "Please confirm your account",
                                text: `Click here to confirm your account.`,
                                html: `Click <a href = "http://localhost:3000/confirm/token=${token}">here</a> to confirm your account.`
                            }, (err, info) => {
                                res.status(400).json({message: err});
                                res.status(200).json({message: info});
                            })
                            res.json(user)
                        })
                        .catch(err => res.status(500).json(err));
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
            } else if (!user.activated) {
                return res.status(403).json({message:"Account not activated"});
            }
            // use bcrypt to compare crypto hash from db and given password
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(401).json({message: "Invalid credentials"});
            }
            // use jwt to sign our user ID to be decoded later, using the key from the .env file
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            
            // returns status 200 with the token and the user information
            return res.status(200).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
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
 * HTTP 500: Any other error
 */

async function handleVerify(req, res) {
    const token = req.header("token");
    if (!token) {
        return res.status(400).json({message: "No token"});
    } else {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({message: "Failed"});
        } else {
            // decoding the token returns us our objectId that we encoded
            const userId =  jwt.decode(token, process.env.JWT_SECRET).id;
            console.log(userId);
            let user;
            try {
                user = await User.findOne(new ObjectId(userId));
                return res.json({
                    username: user.username,
                    email: user.email
                });
            } catch (err) {
                // return error if we somehow encounter an error finding the user
                return res.status(500).json(err);
            }
        }
    }   
}

/**
 * Generates a new password reset token using JWT that holds the user ID in the payload.
 * 
 * @param {object} req The HTTP request, containing the user's email account
 * @param {object} res The HTTP response with the token
 * @returns A HTTP response with the token generated from the user's email address.
 */

async function handleResetRequest(req, res) {
    const email = req.body.email;
    // Ensure the email is specified
    if (!email) {
        return res.status(400).json({message: "Email not specified"});
    } else {
        try {
            // ensure we can find the user
            const user = await User.findOne({email: email})
            if (!user) {
                return res.status(401).json({message: "Invalid user"});
            } else {
                const secret = user._id + '-' + process.env.JWT_TOKEN;
                // currently set the token to expire in 10 minutes
                const token = jwt.sign({id: user._id}, secret, {expiresIn: 600 });
                // auto email sender to send recovery link to reset password.
                await transporter.sendMail({
                    from: '"Allez" <reset@allez.com>',
                    to: `${req.body.email}`,
                    subject: "You requested for a password reset",
                    text: `${token}`,
                    html: `<b>${token}</b>`
                }, (err, info) => {
                    console.log(err);
                    console.log(info);
                })
                return res.status(200).send(token);
            }
        } catch(err) {
            console.log(err);
        }
    }
}

/**
 * End point for the reset password request. Expects a token, an id and a password to be passed in the request.
 * Token will be verified to check if the token matches the user Id passed back, and its expiry. If all are valid, hash the new password
 * and update the database for the password of that user.
 * 
 * @param {*} req The HTTP request, containing the token, id and a new password.
 * @param {*} res THE HTTP response with the result of the request.
 * @returns A HTTP response with the response message.
 */

async function handleReset(req, res) {
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({message: "No token"});
    } else {
        try {
            const id = req.body.id;
            const user = await User.findOne(new ObjectId(id));
            if (!user) {
                return res.status(400).json({message: "Invalid user ID"});
            } else {
                // verify to ensure token has not expired
                jwt.verify(req.body.token, user.id + '-' + process.env.JWT_SECRET);
                // decode to ensure the token matches the userId 
                decoded = jwt.decode(req.body.token, user.id + '-' + process.env.JWT_SECRET).id;
                if (decoded == user.id) {
                    let password;
                    // generate password hash for the new password
                    bcrypt.genSalt().then(salt => bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) {
                            return res.status(500).json({message: "Password error"});
                        } else {
                            password = hash;
                        }
                    }))
                    // update the password field for this user
                    await User.findByIdAndUpdate(new ObjectId(req.body.id),{
                        password: password
                    }, {useFindAndModify: false});
                    return res.status(200).json({message: "Password successfully updated"})
                } else {
                    return res.status(401).json({message: "Unauthorized"})
                }
            }
        } catch(err) {
            // catch the error thrown if the token has expired.
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({message: "Token has expired"})
            }
            // console log for now. TODO: implement error handling
            console.log(err)
        }
    }
}

/**
 * Hanldes account activation. Sets the activated param in the database to true to allow the account to be used.
 * 
 * @param {object} req HTTP request that holds the token in the header as 'token'
 * @param {object} res HTTP response for the request
 * @return Returns the HTTP status and message
 */

async function handleConfirm(req, res) {
    if (!req.headers) {
        return res.status(400).json({message: "Missing header"});
    } else {
        if (!req.headers.token) {
            return res.status(400).json({message: "Missing token"});
        } else {
            try {
                const id = jwt.decode(req.headers.token, process.env.JWT_SECRET).id;
                const user = await User.findOne(new ObjectId(id));
                if (user.activated) {
                    return res.status(403).json({message: "Account already activated"})
                }
                console.log(id);
                await User.findByIdAndUpdate(new ObjectId(id), {activated: true}, {useFindAndModify: false});
                return res.status(200).json({message: "Account successfully activated"})
            } catch (err) {
                return res.status(400).json({message: err});
            }
        }
    }
}



/** Provides the route for the API at ./register using the handleRegister function. */

/**
 * @openapi
 * /api/users/register:
 *  post:
 *      description: Registers a new user onto the database.
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RegisterCredentials'
 *      responses:
 *          200:
 *              description: Sends an email out to the email address registered with
 */
router.post("/register", handleRegister);

/** Provides the route for the API at ./login using the handleLogin function */
router.post("/login", handleLogin);

/** Provides the route for the API at ./check, verifies the JWT token for relogins */
router.get("/verify", handleVerify);

/** Provides the route for the API at ./reset, creates a JWT token for a unique reset link */
router.post("/reset", handleResetRequest);

/** Provides the route for the API at ./reset/end, validates a JWT and authorises a password reset */
router.post("/reset/end", handleReset)

/** Provides the route for the API at ./confirm, activates a user account. */
router.get("/confirm", handleConfirm);


module.exports = router;