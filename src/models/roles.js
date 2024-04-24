'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Permission = require('./permissions');

const roleModel = new Schema({
    name: { type: String, required: true, unique: false, index: { unique: false } },
    permissions: [{ type: Schema.ObjectId, ref: 'Permission', required: true }],
    active: { type: Boolean, required: true },
    description: { type: String, required: true, unique: false, index: { unique: false } },
});

const autoPopulatePermissions = function (next) {
    this.populate('permissions', ['type', 'module']);
    next();
};

roleModel.pre('findOne', autoPopulatePermissions).pre('find', autoPopulatePermissions);

module.exports = mongoose.model('Role', roleModel, 'roles');