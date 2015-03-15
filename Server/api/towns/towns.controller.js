/**
 * Created by Maddie on 3/14/2015.
 */

'use strict';

var _ = require('lodash');
var User = require('./towns.model.js');

exports.getTowns = function(req, res, next) {
    if(req.params.lat == null || req.params.long == null) {  //If the 'long' or 'lat' parameter is missing, return 400
        console.log("Request from %s, missing parameters, sending code 400!", req.connection.remoteAddress);
        return res.send(400, null); //Bad request
    }
    if(parseFloat(req.params.lat) == null || parseFloat(req.params.long) == null) { //If they don't float (heh), return 400
        console.log("Request from %s, bad parameters, sending code 400!", req.connection.remoteAddress);
        return res.send(400, null); //Bad request
    }

    var location = {
        type: "Point",
        coordinates:[parseFloat(req.params.long), parseFloat(req.params.lat)]
    };
    //Distance takes in miles then converts to radians
    var distance = 0.0063;  //25 miles. Arbitrary.
    var options = {
        maxDistance: distance,
        spherical: true
    };
    Town.geoNear(location, options, function(err, results, stats) {
        if(!err) {
            console.log("Sending nearest town to (%s, %s) back to %s", parseFloat(req.params.lat),
                parseFloat(req.params.long), req.connection.remoteAddress);
            if(req.params.nearest != null) {
                return res.send(results[0]);
            }
            else {
                return res.send(results);
            }
        }
        else {
            console.log("Error occurred: %s, IP: %s, Location: (%s, %s)", err, req.connection.remoteAddress,
                req.params.lat, req.params.long);
        }
    });
};
