'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategoryModel = new Schema({
    name: { type: String, required: true, unique: false },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('SubCategory', subCategoryModel, 'subCategories');