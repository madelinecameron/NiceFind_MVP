var restify = require('restify'),
    mongoose = require('mongoose'),
    coords = require('coordinate-systems'),
    fs = require('fs'),
    db_creds = require('./conf/db_conf.json');

var db = mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username%",
    db_creds.db.username).replace("%password%", db_creds.db.password)));  // Pulls username and password from conf file
console.log("Database connection initiated successfully!");

var https_options = {
    name: 'Solobuy_HTTPS_Server',
    key: fs.readFileSync('/etc/sslkeys/ssl.key'),
    certificate: fs.readFileSync('/etc/sslkeys/ssl.crt')
};

var server = restify.createServer({name: 'Solobuy_HTTP_Server' });
var https_server = restify.createServer(https_options);
server.pre(restify.pre.sanitizePath());

//var port = process.argv[2] != null ? process.argv[2] : 3000; //If parameter exists, use as port, if not port 300
server.listen(3000, function() {
    console.log("HTTP Server listening on port %d", 3000);
});

https_server.listen(3001, function() {
    console.log("HTTPS Server listening on port %d", 3001);
});

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());

require('./api/users/index')(server);
require('./api/items/index')(server);
require('./api/towns/index')(server);

server.get('/about', function(req, res, next) {
    res.send("Solobuy was created by Nick Rollins and Madeline Cameron"); //Narcissism!
});