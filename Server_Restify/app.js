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

var Item = mongoose.model('item', itemSchema);

var server = restify.createServer({name: 'Solobuy_Server' });

server.listen(3000, function() {
    console.log("Solobuy server started!");
});

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/search', function(req, res, next) {
    var lat = req.params.lat;
    var long = req.params.long;
    var query = {
        loc: {
            $near: [parseFloat(lat), parseFloat(long)],
            $maxDistance: 500000000
        }
    };
    Item.find(query, function(err, item) {
        console.log(query);
        if(!err) {
            return res.send(item);
        }
        else {
            console.log(item);
        }
    });
});

server.get('/dashboard', function(req, res, next) {

});

server.get('/about', function(req, res, next) {
    res.send("Solobuy was created by Nick Rollins et al");
});

