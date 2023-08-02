import express from "express";

import contactsController from "../../controllers/contactsController.js"

import contactsSchemas from "../../schemas/contactsSchemas.js"

import validateBody from "../../decorators/validateBody.js";

import isEmptyBody from "../../middlewars/isEmptyBody.js";
import isValidId from "../../middlewars/isValidId.js";
import authenticate from "../../middlewars/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate)

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:contactId', isValidId, contactsController.getById);

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsController.add);

contactsRouter.delete('/:contactId', isValidId, isEmptyBody, contactsController.deleteById);

contactsRouter.put('/:contactId', isValidId, validateBody(contactsSchemas.contactsAddSchema), contactsController.updateById);

contactsRouter.patch('/:contactId/favorite', validateBody(contactsSchemas.contactUpdateFavoriteSchema), contactsController.updateStatusContact);


export default contactsRouter
