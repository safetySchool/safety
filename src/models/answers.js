'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var User = require('./users');

const answerModel = new Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    type: { type: String },
    responses: [{ type: Object }],
    date: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
});

var autoPopulateUsers = function(next) {
    this.populate('users', ['id', 'name']);
    next();
};
answerModel.pre('findOne', autoPopulateUsers).pre('find', autoPopulateUsers);

module.exports = mongoose.model('Answers', answerModel, 'answers');