const fetch = require('node-fetch');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Uuid = require('uuid');

const config = require('../config');
const { has } = require('lodash');

module.exports = async (request, h) => {
    try {
        const { userId } = request.payload;
        const now = new Date();
        const token = jwt.sign({ userId, now }, config.jwtSecret);
        return { token: token };
    } catch (error) {
        console.log({ error });
        return h.view('app/login', { error: 'Error interno de la aplicaciÃ³n. Contacte a su administrador.' }, { layout: 'clean' });
    }
};