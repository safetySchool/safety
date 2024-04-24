'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySafetySchoolModel = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, default: '' },
    validated: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('ActivitySafetySchool', activitySafetySchoolModel, 'activitiesSafetySchool');
