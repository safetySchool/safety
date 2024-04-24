module.exports = [{
    method: 'GET',
    path: '/courses',
    options: {
        handler: async function (request, h) {
            return h.view('app/courses');
        }
    }
}];
