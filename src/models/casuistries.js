'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const casuistriesModel = new Schema({
    name: { type: String, required: true, unique: false },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Casuistry', casuistriesModel, 'casuistries');