const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/accidents',
    options: {
        handler: async function (request, h) {
            if (request.auth.credentials.role.name === 'AUDITOR' ||
                request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                request.auth.credentials.role.name === 'GESTOR') {
                return h.view('app/accidents');
            } else {
                return h.redirect('/404');
            }
        }
    }
}];
