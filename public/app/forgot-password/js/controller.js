let controller = {
    async getUser(email) {
        const user = await $.ajax({
            type: 'POST',
            url: '/api/forgotPassword/search_user',
            data: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
        return user;
    },
    async createToken(userId) {
        const token = await $.ajax({
            type: 'POST',
            url: '/forgot-password/createToken',
            data: JSON.stringify({ userId }),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
        return token;
    },
    async saveUser(user) {
        let resp = await fetch('/api/users/forgotPassword', {
            method: 'PATCH',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        });
        return resp;
    }
};
