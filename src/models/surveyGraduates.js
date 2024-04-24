'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const surveyGraduatesModel = new Schema({
    survey: { type: Schema.ObjectId, ref: 'Survey', required: true },
    graduate: { type: Schema.ObjectId, ref: 'Graduate', required: true },
    responses: { type: Array, unique: false, index: { unique: false }, default: [] },
    responseDate: { type: Date,  default: null },
    answered: { type: Boolean, default: false }
}, opts);

module.exports = mongoose.model('SurveyGraduate', surveyGraduatesModel, 'surveyGraduates');
