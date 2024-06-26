'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var User = require('./users');

const selfieModel = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    path: { type: String },
    examName: { type: String },
    date: { type: Date, default: Date.now }
});

var autoPopulateUsers = function(next) {
    this.populate('users', ['id', 'name']);
    next();
};
selfieModel.pre('findOne', autoPopulateUsers).pre('find', autoPopulateUsers);

module.exports = mongoose.model('ExternalExams', selfieModel, 'externalExams');