'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Checkpoint = require('./checkpoints');
const TypeDocument = require('./typesDocuments');
const opts = { toJSON: { virtuals: true } };

const documentModel = new Schema({
    checkpoint: { type: Schema.ObjectId, ref: 'Checkpoint', required: true },
    typeDocument: { type: Schema.ObjectId, ref: 'TypeDocument', required: true },
    date: { type: String, required: true },
    reference: { type: String, required: true },
    active: { type: Boolean, default: true, required: true },
    institution: { type: Schema.ObjectId, ref: 'Institution', required: true },
    validated: { type: Boolean, default: false },
    files: { type: Array, unique: false, index: { unique: false }, default: [] },
}, opts);

module.exports = mongoose.model('Document', documentModel, 'documents');