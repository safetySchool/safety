'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
// var Country = require('./countries');

const plansModel = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    description: { type: String, required: true, unique: false, index: { unique: false } },
    pricing: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
}, opts);

module.exports = mongoose.model('Plans', plansModel, 'plans');