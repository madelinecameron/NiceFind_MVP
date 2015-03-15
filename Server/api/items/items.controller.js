/**
 * Created by Maddie on 3/14/2015.
 */

var _ = require('lodash');
var Items = require('./items.model.js');

exports.getItems = function(req, res, next) {
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
    var maxDist = (req.params.maxDist != null ? parseFloat(req.params.maxDist) : 100) / 3959;
    var minDist = (req.params.minDist != null ? parseFloat(req.params.minDist) : 0);
    var options = {
        minDistance: minDist,
        maxDistance: maxDist,
        limit: 100,
        spherical: true,
        query: (req.params.query != null ? req.params.query : {}) //If query parameter exists, add, if not {}
    };
    Items.geoNear(location, options, function(err, results, stats) {
        if(!err) {
            console.log("Sending all items within %s miles of (%s, %s) back to %s", (req.params.dist != null ?
                    parseFloat(req.params.maxDist) : 100),
                parseFloat(req.params.lat),
                parseFloat(req.params.long), req.connection.remoteAddress);
            return res.send(results);
        }
        else {
            console.log("Error occurred: %s, IP: %s, Location: (%s, %s)", err, req.connection.remoteAddress,
                req.params.lat, req.params.long);
        }
    });
};

exports.getSingleItem = function(req, res, next) {
    Items.find({_id: req.params.id}, { loc: 0 }, function(err, item) {
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
};
