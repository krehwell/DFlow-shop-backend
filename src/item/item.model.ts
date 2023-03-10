import * as mongoose from "mongoose";
import Item from "./item.interface";

const itemSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    total: Number,
});

const itemModel = mongoose.model<Item & mongoose.Document>("Item", itemSchema);

export default itemModel;
