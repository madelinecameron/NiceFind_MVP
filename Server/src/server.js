/**
 * Created by Madeline on 11/24/2014.
 */

var root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require("mongoose"),
    db_creds = require("../conf/db_conf.json");

var app = express.createServer();

mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username",
    db_creds.username).replace("%password%", db_creds.password)));  // Pulls username and password from conf file

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get("/dashboard", function(req, res) {
    res.send("It works!");
});

app.listen(8080);

function readJson(err, data) {
    if(err) throw err;
    db_creds = JSON.parse(data);
    console.log(db_creds);
}