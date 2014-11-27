/**
 * Created by Madeline on 11/25/2014.
 */

var item = new mongoose.Schema({
    id : { type: ObjectId, required: true},
    name : { type: String, required: true },
    description : { type: String, required: false },
    price : { type: Number, required: true },
    date_added : { type: Date, required: true },
    category : { type: Number, required: true },
    lat : { type: Number, required: true },
    long : { type: Number, required: true },
    owner_id : { type: ObjectId, required: true }
});

var item_model = mongoose.model("Item", item, "Items");

function searchForItem(lat, long, response) {
   return item_model.find({lat: {$gte: 37.9120, $lte: 37.9898}, long: {$gte: -91.8051, $lte: -91.72596}},
        function(err, item) {
            console.log("Item ID: %s\nName: %s", item.id, item.name);
        });
}
