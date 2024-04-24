'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Region = require('./regions');

const communeModel = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    region: [{ type: Schema.ObjectId, ref: 'Region' }],
    active: { type: Boolean, default: true }
});

var autoPopulateRegions = function(next) {
    this.populate('regions', ['id', 'name']);
    next();
};

communeModel.pre('findOne', autoPopulateRegions).pre('find', autoPopulateRegions);

module.exports = mongoose.model('Commune', communeModel, 'communes');