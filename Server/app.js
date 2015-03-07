var restify = require('restify'),
    mongoose = require('mongoose'),
    coords = require('coordinate-systems'),
    db_creds = require('./conf/db_conf.json');

var db = mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username%",
    db_creds.db.username).replace("%password%", db_creds.db.password)));  // Pulls username and password from conf file
console.log("Database connection intiated successfully!");

var itemSchema = new mongoose.Schema({
    name : { type: String, required: true },
    description : { type: String, required: false },
    price : { type: Number, required: true },
    date_added : { type: Date, required: true },
    category : { type: Number, required: true },
    loc: { type: [Number], index: '2dsphere', required: true }, //https://github.com/LearnBoost/mongoose/wiki/3.6-
                                                                // Release-Notes#geojson-support-mongodb--24
    owner_id : { type: String, required: true }
});

var userSchema = new mongoose.Schema({
    userName : { type: String, required: true },
    pwdHash: { type: String, required: true },
    email: { type: String, required: true },
    likesList : [{ type: String }]
});

itemSchema.index({"loc" : "2d"});

var Item = mongoose.model('items', itemSchema);
var User = mongoose.model('usesr', userSchema);

var server = restify.createServer({name: 'Solobuy_Server' });

server.listen(3000, function() {
    console.log("Server listening on port 3000");
});

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/search', function(req, res, next) {
    if(req.params.lat == null || req.params.long == null || req.params.dist == null || req.params.anchor == null) {
        console.log("Bad request from %s, sending code 400!", req.connection.remoteAddress)
        return res.send(400, null); //Bad request
    }
    var coordinates = coords.cartesian([req.params.lat, req.params.long]).polar(false);
    var location = {
        type: "Point",
        coordinates: coordinates
    };
    var options = {
        near: coordinates,
        maxDistance: req.params.dist != null ? req.params.dist : 160934, //Default: 100 miles
        spherical: true,
        limit: 50,
        skip: req.params.page != null ? (req.params.page * 50) : 0
    };
    var params = req.params.parameters != null ? req.params.parameters : {};
    Item.geoSearch(params, options, function(err, results, stats) {
        if(!err) {
            console.log("Sending all items local to (%s, %s) back to %s", req.params.lat, req.params.long,
                req.connection.remoteAddress);
            return res.send(results);
        }
        else {
            console.log("Error occurred: %s, IP: %s, Location: (%s, %s)", err, req.connection.remoteAddress,
                req.params.lat, req.params.long);
        }
    });
});

server.get('/item/:id', function(req, res, next) {
    Item.find({_id: req.params.id}, { loc: 0 }, function(err, item) {
        if(!err) {
            console.log("Sending item %s back to %s", req.params.id,
                req.connection.remoteAddress);
            return res.send(item);
        }
        else {
            console.log("Error occurred: %s, IP: %s, Location: (%s, %s)", err, req.connection.remoteAddress,
                req.params.lat, req.params.long);
            return res.send(400, null); //Bad request
        }
    });
});

server.get('/about', function(req, res, next) {
    res.send("Solobuy was created by Nick Rollins and Madeline Cameron");
});

server.get('/likes/get/:id', function(req, res, next) {
    var params = {
        limit: 50,
        skip: req.params.page != null ? (req.params.page * 50) : 0
    };
    User.find({ _id: req.params.id }, { likesList: 1 }, params, function(err, list) {
        return list;
    });
});

server.put('/likes/add/:id', function(req, res, next) {

});
