'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionsModel = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    phone_number_institution: { type: String, required: false },
    email_institution: { type: String, required: false },
    address: { type: String, required: false },
    contact_name: { type: String, required: false },
    supporter: { type: String, required: false },
    dependence: { type: String, required: true },
    level: [{ type: String, required: true }],
    students: { type: Number, required: false },
    disability_students: { type: Number, required: false },
    parents_center: [
        {
            name: { type: String, required: false },
            phone: { type: String, required: false },
            email: { type: String, required: false },
            role: { type: String, required: false },
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
            linkedin: { type: String, required: false },
            required: false,
            _id: false
        }
    ],
    students_center: [
        {
            name: { type: String, required: false },
            phone: { type: String, required: false },
            email: { type: String, required: false },
            role: { type: String, required: false },
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
            linkedin: { type: String, required: false },
            required: false,
            _id: false
        }
    ],
    maps_link: { type: String, required: false },
    web_site: { type: String, required: false },
});

module.exports = mongoose.model('Institution', institutionsModel, 'institutions');
