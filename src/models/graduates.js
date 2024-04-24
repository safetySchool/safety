'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const graduateModel = new Schema({
    year: { type: Number, unique: false, index: { unique: false } },
    course: { type: Schema.ObjectId, ref: 'Course', required: true },
    dni: { type: String, unique: false, index: { unique: false } },
    name: { type: String, unique: false, index: { unique: false } },
    lastname: { type: String, unique: false, index: { unique: false } },
    email: { type: String, unique: false, index: { unique: false } },
    phone: { type: Number, unique: false, index: { unique: false } },
    active: { type: Boolean, default: true }
}, opts);
graduateModel.virtual('fullname').get(function () {
    return `${this.name} ${this.lastname}`;
});

module.exports = mongoose.model('Graduate', graduateModel, 'graduates');
