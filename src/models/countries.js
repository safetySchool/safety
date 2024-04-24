'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countriesModel = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Country', countriesModel, 'countries');