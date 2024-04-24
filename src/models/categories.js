'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryModel = new Schema({
    name: { type: String, required: true, unique: false },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Category', categoryModel, 'categories');