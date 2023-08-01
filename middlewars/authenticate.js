import HttpError from "../helpers/HttpError.js";

import controllerWrapper from "../decorators/controllerWrapper.js";

import jwt from "jsonwebtoken";

import User from "../models/user.js";

import "dotenv/config";

const {JWT_SECRET} = process.env;
const authenticate = async (req, res, next) => {
    const {authorization = ''} = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== "Bearer") {
        throw HttpError(401)
    }
    try {
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user || !user.token) {
            throw HttpError(401)
        }
        req.user = user;
        next()
    } catch (error) {
        throw HttpError(401, error.message)
    }
}
export default controllerWrapper(authenticate)