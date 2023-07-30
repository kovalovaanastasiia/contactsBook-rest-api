import express from "express";

import contactsController from "../../controllers/contactsController.js"

import contactsAddSchema from "../../schemas/contactsSchemas.js";
import contactUpdateFavoriteSchema from "../../schemas/contactsSchemas.js"

import validateBody from "../../decorators/validateBody.js";

import isEmptyBody from "../../middlewars/isEmptyBody.js";
import isValidId from "../../middlewars/isValidId.js";

const router = express.Router();


router.get('/', contactsController.getAll);

router.get('/:contactId', isValidId, contactsController.getById);

router.post('/', isEmptyBody, validateBody(contactsAddSchema), contactsController.add);

router.delete('/:contactId', isValidId, isEmptyBody, contactsController.deleteById);

router.put('/:contactId', isValidId, validateBody(contactsAddSchema), contactsController.updateById);

router.patch('/:contactId/favorite', validateBody(contactUpdateFavoriteSchema), contactsController.updateStatusContact);

export default router
