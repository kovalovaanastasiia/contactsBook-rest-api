import fs from "fs/promises";
import path from "path";
import {nanoid} from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");
const updateContactsStorage = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const listContacts = async () => {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
};

export const getContactById = async (contactId) => {
    const contacts = await listContacts();
    const result = contacts.find((contact) => contact.id === contactId);
    return result || null;
};

export const removeContact = async (contactId) => {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const [results] = contacts.splice(index, 1);
    await updateContactsStorage(contacts);
    return results;
};

export const addContact = async ({name, email, phone}) => {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    };
    contacts.push(newContact);
    await updateContactsStorage(contacts);
    return newContact;
};

export const updateContact = async (contactId, {name, email, phone}) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    contacts[index] = {contactId, name, email, phone};
    await updateContactsStorage(contacts);
    return contacts[index];
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}
