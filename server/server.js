const app = require("./index");
const mongoose = require("mongoose");

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started on port 3001");
});
