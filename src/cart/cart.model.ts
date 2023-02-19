import * as mongoose from "mongoose";
import Cart from "./cart.interface";

const cartSchema = new mongoose.Schema({
    id: String,
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    items: {
        ref: "Item",
        type: [mongoose.Schema.Types.ObjectId],
    },
});

const cartModel = mongoose.model<Cart & mongoose.Document>("Cart", cartSchema);

export default cartModel;
