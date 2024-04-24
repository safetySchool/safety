// eslint-disable-next-line no-unused-vars
let controller = {
    savePermission(data) {
        const {
            module,
            action,
            description,
            active
        } = data;
        return $.ajax({
            type: 'POST',
            url: '/api/permissions',
            data: {
                module,
                action,
                description,
                active
            },
            dataType: 'json'
        });
    },
    updatePermission(data) {
        const {
            _id,
            module,
            action,
            description,
            active
        } = data;
        return $.ajax(
            {
                type: 'PATCH',
                url: '/api/permissions',
                data: {
                    _id,
                    module,
                    action,
                    description,
                    active
                },
                dataType: 'json'
            });
    }
};
