/**
 * Created by Maddie on 3/14/2015.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    userName : { type: String, required: true },
    pwdHash: { type: String, required: true },
    email: { type: String, required: true },
    likesList : [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);
