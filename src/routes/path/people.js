const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/people/teachers',
    options: {
        handler: async function (request, h) {
            if (request.auth.credentials.role.name === 'AUDITOR' ||
                request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                request.auth.credentials.role.name === 'GESTOR') {
                return h.view('app/teachers');
            } else {
                return h.redirect('/404');
            }
        }
    }
}, {
    method: 'GET',
    path: '/people/contractors',
    options: {
        handler: async function (request, h) {
            if (request.auth.credentials.role.name === 'AUDITOR' ||
                request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                request.auth.credentials.role.name === 'GESTOR') {
                return h.view('app/contractor');
            } else {
                return h.redirect('/404');
            }
        }
    }
}];
