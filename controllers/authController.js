import bcrypt from 'bcrypt';

import jwt from "jsonwebtoken";

import "dotenv/config";

import fs from "fs/promises";

import path from "path";

import gravatar from "gravatar";

import Jimp from "jimp";

import User from "../models/user.js";

import controllerWrapper from "../decorators/controllerWrapper.js";

import HttpError from "../helpers/HttpError.js";



const {JWT_SECRET} = process.env;

const avatarPath = path.resolve("public", "avatars");

const signUp = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
        throw HttpError(409, `Such email ${user.email} is already registered`);
    }

    const avatarURL = gravatar.url(email)

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL,
        },
    })
};

const signIn = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});

    res.status(200).json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription
        },
    });
};

const getCurrent = async (req, res) => {
    const {email, subscription} = req.user;

    res.status(200).json({
        email,
        subscription,
    });
};

const signOut = async (req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json({message: "Successful signOut"})
};

const updateSubscription = async (req, res) => {
    const {_id} = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body, {new: true});

    res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarPath, filename);

    const resizedAvatar = await Jimp.read(oldPath);
    resizedAvatar.resize(250, 250);
    resizedAvatar.write(oldPath);

    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);

    await User.findByIdAndUpdate(_id, {avatarURL})

    res.status(200).json({ avatarURL });

}
export default {
    signUp: controllerWrapper(signUp),
    signIn: controllerWrapper(signIn),
    getCurrent: controllerWrapper(getCurrent),
    signOut: controllerWrapper(signOut),
    updateSubscription: controllerWrapper(updateSubscription),
    updateAvatar: controllerWrapper(updateAvatar),
}