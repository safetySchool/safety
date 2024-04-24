const Boom = require('@hapi/boom');
const { parse } = require('handlebars');

module.exports = [
    {
        method: 'GET',
        path: '/institutionSelection',
        options: {
            handler: async function (request, h) {
                return h.view('app/institutionSelection');
            }
        }
    }
];
