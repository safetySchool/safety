const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/newPassword',
    options: {
        auth: { mode: 'try' },
        handler: async function (request, h) {
            return h.view('app/newPassword', null, { layout: 'clean' });
        }
    }
}];
