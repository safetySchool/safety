'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
var Country = require('./countries');

const regionModel = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    country: [{ type: Schema.ObjectId, ref: 'Country' }],
    active: { type: Boolean, default: true }
}, opts);

module.exports = mongoose.model('Region', regionModel, 'regions');