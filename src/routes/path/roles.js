const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/roles',
    options: {
        handler: async function (request, h) {
            if (request.auth.credentials.role.name === 'ADMINISTRADOR') {
                return h.view('app/roles');
            } else {
                return h.redirect('/404');
            }
        }
    }
}];
