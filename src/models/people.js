'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const peopleModel = new Schema({
    institution: { type: Schema.ObjectId, ref: 'Institution', required: true },
    type: { type: String, unique: false, index: { unique: false } },
    cargo: { type: String, unique: false, index: { unique: false } },
    empresa: { type: String, unique: false, index: { unique: false } },
    rut_empresa: { type: String, unique: false, index: { unique: false } },
    documents: { type: Array, unique: false, index: { unique: false }, default: [] },
    name: { type: String, unique: false, index: { unique: false } },
    lastname: { type: String, unique: false, index: { unique: false } },
    dni: { type: String, unique: false, index: { unique: false } },
    phone: { type: Number, unique: false, index: { unique: false } },
    email: { type: String, unique: false, index: { unique: false } },
    active: { type: Boolean, default: true }
}, opts);
peopleModel.virtual('fullname').get(function () {
    return `${this.name} ${this.lastname}`;
});

module.exports = mongoose.model('People', peopleModel, 'peoples');
