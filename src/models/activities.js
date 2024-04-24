'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityModel = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    institution: { type: Schema.ObjectId, ref: 'Institution', required: true },
    active: { type: Boolean, required: true, default: true },
    validated: { type: Boolean, required: true, default: false },
    date: { type: String, default: '' },
    files: { type: Array, unique: false, index: { unique: false }, default: [] }
});

module.exports = mongoose.model('Activity', activityModel, 'activities');
