/**
 * Created by Maddie on 3/14/2015.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var townSchema = new Schema({
    name : { type: String, required: true },
    location: { type: [], required: true, index: '2dsphere' },
    county_name : { type: String, required: true },
    state_abbr : { type: String, required: true }
});

townSchema.index({"location" : "2dsphere"});

module.exports = mongoose.model('towns', townSchema);