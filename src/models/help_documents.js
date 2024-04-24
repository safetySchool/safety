'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Checkpoint = require('./checkpoints');
const TypeDocument = require('./typesDocuments');
const opts = { toJSON: { virtuals: true } };

const help_documentsModel = new Schema({
    checkpoint: { type: Schema.ObjectId, ref: Checkpoint, required: true },
    typeDocument: { type: Schema.ObjectId, ref: TypeDocument, required: true },
    files: { type: Array, unique: false, index: { unique: false }, default: [] },
}, opts);

module.exports = mongoose.model('Help_documents', help_documentsModel, 'help_documents');