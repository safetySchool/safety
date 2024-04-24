const fetch = require('node-fetch');
const config = require('../config/');
const jwt = require('../helpers/jwt');

module.exports = {
    name: 'CodePacsServerExt',
    register: async function(Server, options) {

        Server.ext('onPreResponse', async function(request, h) {
            const response = request.response;
            const credentials = request.auth.credentials;
            if (response.variety && response.variety === 'view') {
                response.source.context = response.source.context || {};
                if (request.auth.isAuthenticated) {
                    response.source.context.credentials = credentials;
                } else {
                    response.source.context.credentials = {};
                }
            }
            return h.continue;
        });
    }
};
