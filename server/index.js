/** Imports for express */
const express = require('express');
const app = express();

/** Imports for mongoDB */
const mongoose = require('mongoose');

/** Imports for CORS policy */
const cors = require('cors');


app.use(express.json());
app.use(cors());

/** Import User API */
const users = require('./routes/api/Users');



/**
 * Route for User API
 */
app.use("/api/users", users)



/**
 * Connects to the MongoDB atlas server. Only starts the server if the connection to the DB is successful.
 */
mongoose.connect("mongodb+srv://allez:allez@allez.1bbnv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(3001, () => {
        console.log("Server started on port 3001");
    })
})


/**
 * Boilerplate GET request to test root.
 */

app.get("/", async(req, res) => {
    res.json("test");
    UserModel.find({}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    })
})
