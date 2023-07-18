import contactsService from "../models/contacts.js"

import controllerWrapper from "../decorators/controllerWrapper.js";


import HttpError from "../helpers/HttpError.js";

const getAll = async (req, res) => {
    const result = await contactsService.listContacts()
    res.json(result)
};
const getById = async (req, res) => {
    const {contactId} = req.params;
    const result = await contactsService.getContactById(contactId)
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`)
    }
    res.json(result)
};
const add = async (req, res) => {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
};
const deleteById = async (req, res) => {
    const {contactId} = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`);
    }
    res.json({
        message: `Contact with id ${contactId} was successfully deleted`
    })
};
const updateById = async (req, res) => {
    const {contactId} = req.params;
    const result = await contactsService.updateContact(contactId, req.body);
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`);
    }
    res.json(result);
};

export default {
    getAll: controllerWrapper(getAll),
    getById: controllerWrapper(getById),
    add: controllerWrapper(add),
    deleteById: controllerWrapper(deleteById),
    updateById: controllerWrapper(updateById)
}