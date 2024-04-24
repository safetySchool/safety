const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/users',
    options: {
        handler: async function (request, h) {
            if (request.auth.credentials.role.name === 'AUDITOR' || request.auth.credentials.role.name === 'ADMINISTRADOR') {
                return h.view('app/users');
            } else {
                return h.redirect('/404');
            }
        }
    }
}];
