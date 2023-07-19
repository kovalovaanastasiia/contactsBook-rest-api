import express from "express";

import contactsController from "../../controllers/contactsController.js"

import contactsAddSchema from "../../schemas/contactsSchemas.js";

import validateBody from "../../decorators/validateBody.js";

import isEmptyBody from "../../middlewars/isEmptyBody.js";

const router = express.Router()


router.get('/', contactsController.getAll)

router.get('/:contactId', contactsController.getById)

router.post('/', isEmptyBody, validateBody(contactsAddSchema), contactsController.add)

router.delete('/:contactId', isEmptyBody, contactsController.deleteById)

router.put('/:contactId', validateBody(contactsAddSchema), contactsController.updateById)

export default router
