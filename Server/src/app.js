var root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require("mongoose"),
    db_creds = require("../conf/db_conf.json");

var app = express();

console.log("Server has started!");

mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username%",
    db_creds.db.username).replace("%password%", db_creds.db.password)));  // Pulls username and password from conf file

console.log("Database successfully connected!");

app.get("/dashboard", function(req, res) {
    res.send("It works!");
});

app.listen(8080);