'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseModel = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Course', courseModel, 'courses');
