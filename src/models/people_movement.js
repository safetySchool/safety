'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitiesMOvementModel = new Schema({
    people: {type: Schema.ObjectId, ref: 'People', required: true},
    typeDocument: {type: String, required: true},
    date: {type: String, required: true},
    reference: {type: String, required: true},
    active: {type: Boolean, default: true, required: true},
    institution: {type: Schema.ObjectId, ref: 'Institution', required: true},
    validated: {type: Boolean, default: false},
    files: {type: Array, unique: false, index: {unique: false}, default: []},
});

module.exports = mongoose.model('PeopleMovement', activitiesMOvementModel, 'peopleMovement');
