import express from 'express';

import validateBody from "../../decorators/validateBody.js";

import usersSchemas from "../../schemas/usersSchemas.js";

import authController from "../../controllers/authController.js";

import authenticate from "../../middlewars/authenticate.js";

import isEmptyBody from "../../middlewars/isEmptyBody.js";

import upload from "../../middlewars/upload.js";

const authRouter = express.Router();

authRouter.post('/signup', validateBody(usersSchemas.authSchema), authController.signUp)

authRouter.post('/signin', validateBody(usersSchemas.authSchema), authController.signIn)

authRouter.post("/signout", authenticate, authController.signOut);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.patch("/", authenticate, isEmptyBody, validateBody(usersSchemas.updateSubscriptionSchema), authController.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;