const Boom = require('@hapi/boom');

module.exports = [{
    method: 'GET',
    path: '/',
    options: {
        handler: async function (request, h) {
            return h.view('app/index');
        }
    }
}, {
    method: 'GET',
    path: '/public/{param*}',
    options: {
        auth: false,
        handler: {
            directory: {
                path: './public',
                redirectToSlash: true,
                index: true
            }
        }
    }
}, {
    method: 'GET',
    path: '/tools/{path*}',
    options: {
        auth: false,
        handler: {
            directory: {
                path: './bower_components',
                listing: false,
                index: false
            }
        }
    }
}];
