var restify = require('restify'),
    mongoose = require('mongoose'),
    coords = require('coordinate-systems'),
    db_creds = require('./conf/db_conf.json');

var db = mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username%",
    db_creds.db.username).replace("%password%", db_creds.db.password)));  // Pulls username and password from conf file
console.log("Database connection initiated successfully!");

var itemSchema = new mongoose.Schema({
    name : { type: String, required: true },
    description : { type: String, required: false },
    price : { type: Number, required: true },
    date_added : { type: Date, required: true },
    category : { type: Number, required: true },
    loc: { type: [Number], required: true, index: '2dsphere' }, //https://github.com/LearnBoost/mongoose/wiki/3.6-
                                                                // Release-Notes#geojson-support-mongodb--24
    owner_id : { type: String, required: true }
});

var userSchema = new mongoose.Schema({
    userName : { type: String, required: true },
    pwdHash: { type: String, required: true },
    email: { type: String, required: true },
    likesList : [{ type: String }]
});

var townSchema = new mongoose.Schema({
    name : { type: String, required: true },
    fence: { type: [], required: true, index: '2dsphere' }
});

itemSchema.index({"loc" : "2dsphere"});
townSchema.index({"fence" : "2dsphere"});

var Item = mongoose.model('items', itemSchema);
var User = mongoose.model('user', userSchema);
var Town = mongoose.model('town', townSchema);

var server = restify.createServer({name: 'Solobuy_Server' });

var port = process.argv[2] != null ? process.argv[2] : 3000; //If parameter exists, use as port, if not port 300
server.listen(port, function() {
    console.log("Server listening on port %d", port);
});

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/search', function(req, res, next) {

    if(req.params.lat == null || req.params.long == null) {  //If the 'long' or 'lat' parameter is missing, return 400
        console.log("Request from %s, missing parameters, sending code 400!", req.connection.remoteAddress)
        return res.send(400, null); //Bad request
    }
    if(parseFloat(req.params.lat) == null || parseFloat(req.params.long) == null) { //If they don't float (heh), return 400
        console.log("Request from %s, bad parameters, sending code 400!", req.connection.remoteAddress)
        return res.send(400, null); //Bad request
    }

    var location = {
        type: "Point",
        coordinates:[parseFloat(req.params.long), parseFloat(req.params.lat)]
    };
    //Distance takes in miles then converts to radians
    var distance = (req.params.dist != null ? parseFloat(req.params.dist) : 100) / 3959;
    var options = {
        maxDistance: distance,
        spherical: true,
        query: (req.params.query != null ? req.params.query : {}) //If query parameter exists, add, if not {}
    };
    Item.geoNear(location, options, function(err, results, stats) {
        if(!err) {
            console.log("Sending all items within %s miles of (%s, %s) back to %s", (req.params.dist != null ?
                    parseFloat(req.params.dist) : 100),
                parseFloat(req.params.lat),
                parseFloat(req.params.long), req.connection.remoteAddress);
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

server.get('/likes/get/:id', function(req, res, next) {
    var params = {
        limit: 50,
        skip: req.params.page != null ? (req.params.page * 50) : 0
    };
    User.find({ _id: req.params.id }, { likesList: 1 }, params, function(err, list) {
        return list;
    });
});

server.put('/likes/add/:itemId', function(req, res, next) {
    User.findByIdAndUpdate(
        req.params.userId,
        {$push: {likesList: req.params.itemId}}, //Pushes itemId onto likesList
        {safe: true, upsert: true},
        function (err, model) {
            console.log(err);
        }
    );
});

server.get('/town', function(req, res, next) {
    if(req.params.lat == null || req.params.long == null) {  //If the 'long' or 'lat' parameter is missing, return 400
        console.log("Request from %s, missing parameters, sending code 400!", req.connection.remoteAddress)
        return res.send(400, null); //Bad request
    }
    if(parseFloat(req.params.lat) == null || parseFloat(req.params.long) == null) { //If they don't float (heh), return 400
        console.log("Request from %s, bad parameters, sending code 400!", req.connection.remoteAddress)
        return res.send(400, null); //Bad request
    }
});

server.get('/about', function(req, res, next) {
    res.send("Solobuy was created by Nick Rollins and Madeline Cameron"); //Narcissism!
});