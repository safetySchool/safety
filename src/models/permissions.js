'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionModel = new Schema({
    module: { type: String, required: true, unique: false, index: { unique: false } },
    action: { type: String, required: true, unique: false, index: { unique: false } },
    description: { type: String, required: true, unique: false, index: { unique: false } },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Permission', permissionModel, 'permissions');