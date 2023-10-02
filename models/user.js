import {Schema, model} from "mongoose";

import {handleSaveError, validateAtUpdate} from "./hooks.js";

import {emailRegexp, subscriptionList} from "../constants/user-constants.js";


const userSchema = new Schema({
    avatarURL: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: emailRegexp,
        unique: true,
    },
    subscription: {
        type: String,
        enum: subscriptionList,
        default: "starter"
    },
    token: {
        type: String
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
       type: String
    }
}, {versionKey: false, timestamps: true});

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleSaveError);

userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User
