import Contact from "../models/contact.js";

import controllerWrapper from "../decorators/controllerWrapper.js";


import HttpError from "../helpers/HttpError.js";

const getAll = async (req, res) => {
    const result = await Contact.find();
    res.json(result)
};
const getById = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findById(contactId)
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`)
    }
    res.json(result)
};
const add = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};
const deleteById = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`);
    }
    res.json({
        message: `Contact with id ${contactId} was successfully deleted`
    })
};
const updateById = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`);
    }
    res.json(result);
};
const updateStatusContact = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`);
    }
    res.json(result);
};
export default {
    getAll: controllerWrapper(getAll),
    getById: controllerWrapper(getById),
    add: controllerWrapper(add),
    updateStatusContact: controllerWrapper(updateStatusContact),
    deleteById: controllerWrapper(deleteById),
    updateById: controllerWrapper(updateById)
}