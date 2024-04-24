const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/404',
    options: {
        handler: async function (request, h) {
            return h.view('app/404', null, { layout: 'clean' });
        }
    }
}];