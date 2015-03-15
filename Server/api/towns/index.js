/**
 * Created by Maddie on 3/14/2015.
 */

'use strict';

var controller = require('./towns.controller');

module.exports = function(server) {
    server.get('/towns', controller.getTowns);
};
