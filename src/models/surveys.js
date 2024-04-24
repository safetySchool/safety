'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const surveyModel = new Schema({
    years: { type: Array, unique: false, index: { unique: false } },
    createdAt: { type: Date, default: Date.now },
    lastUpdate: { type: Date,default: null },
    closed: { type: Boolean, default: false }
}, opts);

module.exports = mongoose.model('Survey', surveyModel, 'surveys');
