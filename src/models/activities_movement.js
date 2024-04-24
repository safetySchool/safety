'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitiesMOvementModel = new Schema({
    activity: {type: Schema.ObjectId, ref: 'Activity', required: true},
    typeDocument: {type: Schema.ObjectId, ref: 'TypeDocument', required: true},
    permissions: [{type: Schema.ObjectId, ref: 'Permission', required: true}],
    date: {type: String, required: true},
    reference: {type: String, required: true},
    active: {type: Boolean, default: true, required: true},
    institution: {type: Schema.ObjectId, ref: 'Institution', required: true},
    validated: {type: Boolean, default: false},
    files: {type: Array, unique: false, index: {unique: false}, default: []}
});


module.exports = mongoose.model('Activitymovement', activitiesMOvementModel, 'activitymovement');
