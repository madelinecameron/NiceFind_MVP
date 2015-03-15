/**
 * Created by Maddie on 3/14/2015.
 */

'use strict';

var controller = require('./users.controller');

module.exports = function(server) {
    server.get('/users/likes', controller.addLike);
    server.get('/users/me', controller.me);
    server.post('/users/register', controller.register);
    server.post('/users/login', controller.login);
    server.post('/users/likes', controller.getLikes);
}
