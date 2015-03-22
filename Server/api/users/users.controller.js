/**
 * Created by Maddie on 3/14/2015.
 */

'use strict';

var _ = require('lodash');
var User = require('./users.model.js');
var passwordHash = require('password-hash');

exports.register = function(req, res, next) {
    User.create({
        userName: req.params.userName,
        pwdHash: req.params.pwdHash,
        email: req.params.email
    }, function(err, result) {
        if(err) {
            return res.send(400, null);
        }
        else {
            return res.send(200);
        }
    });
};

exports.getLikes = function(req, res, next) {
    var params = {
        limit: 50,
        skip: req.params.page != null ? (req.params.page * 50) : 0
    };
    User.find({ _id: req.params.id }, { likesList: 1 }, params, function(err, list) {
        return list;
    });
};

exports.addLike = function(req, res, next) {
    User.findByIdAndUpdate(
        req.params.userId,
        {$push: {likesList: req.params.itemId}}, //Pushes itemId onto likesList
        {safe: true, upsert: true},
        function (err, model) {
            console.log(err);
        }
    );
};

exports.me = function(req, res, next) {
    throw NOT_IMPLEMENTED;
};

exports.login = function(req, res, next) {
    console.log(req);
    console.log(req.body.username);
    return res.send(200);
    User.find({username: req.body.username }, function(err, user) {
        res.send(passwordHash.verify(req.body.password, user.password));
    });
};

function handleError(res, err) {
    return res.send(500, err);
}

//// Get a single comment
//exports.register = function(req, res) {
//    Comment.findById(req.params.id, function (err, comment) {
//        if(err) { return handleError(res, err); }
//        if(!comment) { return res.send(404); }
//        return res.json(comment);
//    });
//};
