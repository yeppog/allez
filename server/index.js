const express = require('express');
const app = express();

app.use(express.json());

app.get("/", async(req, res) => {
    res.json("test");
})

app.listen(3001, () => {
    console.log("Server running on port 3001");
})