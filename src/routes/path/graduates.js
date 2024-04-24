module.exports = [{
    method: 'GET',
    path: '/graduates',
    options: {
        handler: async function (request, h) {
            return h.view('app/graduates');
        }
    }
}];
