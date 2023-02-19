import * as mongoose from "mongoose";
import User from "./user.interface";

const userSchema = new mongoose.Schema({
    username: String,
    password: {
        type: String,
        get: (): undefined => undefined,
    },
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
