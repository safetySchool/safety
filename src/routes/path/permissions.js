const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/permissions',
    options: {
        handler: async function (request, h) {
            if (request.auth.credentials.role.name === 'ADMINISTRADOR') {
                return h.view('app/permissions');
            } else {
                return h.redirect('/404');
            }
        }
    }
}];
