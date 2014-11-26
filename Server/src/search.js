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
    coordinates : { type: Array, required: true },
    owner_id : { type: ObjectId, required: true }
});

var ItemModel = mongoose.model("Item", item);

function searchForItem(lat, long, response) {
    return 0;
}
