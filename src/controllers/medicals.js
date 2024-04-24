const fs = require('fs');
const shell = require('shelljs');
const Path = require('path');
const Moment = require('moment');

var Medical = require('../models/medical');


exports.list = async (request, h) => {
    try {
        const medical = await Medical.find().lean();
        return medical;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    let patient = request.query.patient;
    try {
        return await Medical.find({ patient }).populate('user', ['name', 'lastname']).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const medical = await Medical.findById(request.params.id).exec();
        if (!medical) { return { message: 'Registro no encontrado' }; }
        return medical;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const medicalData = {
            user: request.payload.user,
            patient: request.payload.patient,
            comment: request.payload.comment
        };
        const medical = await Medical.create(medicalData);
        return { message: 'Registro creado con exito', medical };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const medical = await Medical.findById(request.payload.id).exec();
        if (!medical) { return { err: 'Registro no encontrado' }; }

        medical.comment = request.payload.comment || medical.comment;

        await medical.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};