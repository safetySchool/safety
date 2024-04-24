module.exports = [{
    method: 'GET',
    path: '/%table%',
    handler: async(request, h) => {
        return h.view('app/%table%');
    }
}];