'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var User = require('./users');

const selfieModel = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    patient: { type: Schema.ObjectId, ref: 'User' },
    comment: { type: String, default: 'front' },
    date: { type: Date, default: Date.now },
});

var autoPopulateUsers = function(next) {
    this.populate('users', ['id', 'name']);
    next();
};
var autoPopulatePatients = function(next) {
    this.populate('users', ['id', 'name']);
    next();
};
selfieModel.pre('findOne', autoPopulateUsers).pre('find', autoPopulateUsers);
selfieModel.pre('findOne', autoPopulatePatients).pre('find', autoPopulatePatients);

module.exports = mongoose.model('Medicals', selfieModel, 'medicals');