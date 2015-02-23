var restify = require('restify'),
    mongoose = require('mongoose'),
    db_creds = require('./conf/db_conf.json');

var db = mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username%",
    db_creds.db.username).replace("%password%", db_creds.db.password)));  // Pulls username and password from conf file

var itemSchema = new mongoose.Schema({
    id : { type: String, required: true},
    name : { type: String, required: true },
    description : { type: String, required: false },
    price : { type: Number, required: true },
    date_added : { type: Date, required: true },
    category : { type: Number, required: true },
    loc: { type: [Number], index: '2dsphere', required: true }, //https://github.com/LearnBoost/mongoose/wiki/3.6-
                                                                // Release-Notes#geojson-support-mongodb--24
    owner_id : { type: String, required: true }
});

itemSchema.index({"loc" : "2d"});
var Item = mongoose.model('items', itemSchema);
var server = restify.createServer({name: 'Solobuy_Server' });

server.listen(3000, function() {
    console.log("Solobuy server started!");
});

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/search', function(req, res, next) {
    if(req.params.lat == null || req.params.long == null) {
        console.log("R");
        return res.send(400, null); //Bad request
    }
    var location = {
        type: "Point",
        coordinates: [99.313603256955, -67.531012129345]
    };
    Item.geoNear(location, {maxDistance: 1000, spherical: true }, function(err, results, stats) {
        if(!err) {
            console.log("Item: ");
            console.log(results);
            return res.send(results);
        }
        else {
            console.log(err);
        }
    });
});

server.get('/dashboard', function(req, res, next) {
    console.log("Q");
    if(req.params.lat == null || req.params.long == null) {
        console.log("R");
        return res.send(400, null); //Bad request
    }
    var location = {
        type: "Point",
        coordinates: [99.313603256955, -67.531012129345]
    };
    Item.geoNear(location, {maxDistance: 1000, spherical: true }, function(err, results, stats) {
        if(!err) {
            console.log("Item: ");
            console.log(results);
            return res.send(results);
        }
        else {
            console.log(err);
        }
    });
});

server.get('/about', function(req, res, next) {
    res.send("Solobuy was created by Nick Rollins and Madeline Cameron");
});

