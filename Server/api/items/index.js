/**
 * Created by Maddie on 3/14/2015.
 */

'use strict';

var controller = require('./items.controller');

module.exports = function(server) {
    server.get('/items', controller.getItems);
    server.get('/items/:id', controller.getSingleItem);
};
