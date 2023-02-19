import * as mongoose from "mongoose";
import Item from "./item.interface";

const itemSchema = new mongoose.Schema({
    author: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    content: String,
    title: String,
});

const itemModel = mongoose.model<Item & mongoose.Document>("Item", itemSchema);

export default itemModel;
