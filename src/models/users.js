'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const userModel = new Schema({
    institution: [{ type: Schema.ObjectId, ref: 'Institution', required: true }],
    role: { type: Schema.ObjectId, ref: 'Role', required: true },
    login: { type: String, unique: false, index: { unique: false } },
    name: { type: String, unique: false, index: { unique: false } },
    lastname: { type: String, unique: false, index: { unique: false } },
    email: { type: String, unique: false, index: { unique: false } },
    password: { type: String },
    superAdmin: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    token: { type: String, default: null, required: false },
}, opts);
userModel.virtual('fullname').get(function () {
    return `${this.name} ${this.lastname}`;
});

module.exports = mongoose.model('User', userModel, 'users');
