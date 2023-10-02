import Joi from "joi";

import {emailRegexp, subscriptionList} from "../constants/user-constants.js";

const authSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegexp)
        .required()
        .messages({
            "any.required": `"email" must be exist`
        }),
    password: Joi.string()
        .required()
        .messages({
            "any.required": `"password" must be exist`
        }),
});

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string()
        .valid(...subscriptionList)
        .required()
        .messages({
            "any.required": 'missing required "subscription" field',
        }),
});

const userEmailSchema = Joi.object({
    email: Joi.string()
        .pattern(emailRegexp)
        .required()
        .messages({
            "any.required": `"email" must be exist`
        }),
});
export default {
    authSchema,
    updateSubscriptionSchema,
    userEmailSchema
}