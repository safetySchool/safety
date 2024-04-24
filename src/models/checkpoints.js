'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('./categories');
const SubCategory = require('./subCategories');

const checkpointModel = new Schema({
    description: { type: String, required: true },
    position: { type: Number, required: true },
    type: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    dateUpdate: { type: String, default: Date.now }
});

module.exports = mongoose.model('Checkpoint', checkpointModel, 'checkpoints');
