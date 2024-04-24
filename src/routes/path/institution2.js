const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/institution2',
    options: {
        handler: async function (request, h) {
            if (request.auth.credentials.role.name === 'ADMINISTRADOR') {
                return h.view('app/institution2');
            } else {
                return h.redirect('/404');
            }
        }
    }
}];