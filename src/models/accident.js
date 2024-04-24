'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const accidentModel = new Schema({
    institution: { type: Schema.ObjectId, ref: 'Institution', required: true },
    date: { type: Date },
    dateUp: { type: Date },
    cargo: { type: String, unique: false, index: { unique: false } },
    type: { type: String, unique: false, index: { unique: false } },
    casuistry: { type: Schema.ObjectId, ref: 'Casuistry', required: true },
    documents: { type: Array, unique: false, index: { unique: false }, default: [] },
    name: { type: String, unique: false, index: { unique: false } },
    dni: { type: String, unique: false, index: { unique: false } },
    days: { type: Number, unique: false, index: { unique: false } },
    active: { type: Boolean, default: true }
}, opts);

module.exports = mongoose.model('Accident', accidentModel, 'accident');
