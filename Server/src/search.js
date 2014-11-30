/**
 * Created by Madeline on 11/25/2014.
 */

var mongoose = require("mongoose");

var item = new mongoose.Schema({
    id : { type: String, required: true},
    name : { type: String, required: true },
    description : { type: String, required: false },
    price : { type: Number, required: true },
    date_added : { type: Date, required: true },
    category : { type: Number, required: true },
    lat : { type: Number, required: true },
    long : { type: Number, required: true },
    owner_id : { type: String, required: true }
});

var item_model = mongoose.model("Item", item, "items");

module.exports = {
    search: function (query, response) {
        return item_model.find(query, function(err, item) {
            if(!err) {
                return response.send(item);
            }
            else {
                console.log(item);
            }
        });
    },
};
