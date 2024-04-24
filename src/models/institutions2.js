'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionsModel2 = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    region: { type: String, required: false },
    province: { type: String, required: false },
    commune: { type: String, required: false },
    address: { type: String, required: false },
    active: { type: Boolean, default: true },
    phone_number_institution: { type: String, required: false },
    email_institution: { type: String, required: false },
    maps_link: { type: String, required: false }
});

module.exports = mongoose.model('Institution2', institutionsModel2, 'institutions');
