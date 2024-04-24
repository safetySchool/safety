let controller = {
    openLogo(logo) {
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("img01");

        modal.style.display = "block";
        modalImg.src = logo;

        const span = document.getElementById("closeModal");

        span.onclick = function () {
            modal.style.display = "none";
        }
    },
    saveItem(data) {
        return $.ajax({
            type: 'POST',
            url: '/api/institution',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    updateItem(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/institution',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    getInstitution(data) {
        return $.ajax({
            type: 'GET',
            url: '/api/institution/' + data,
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    removeInstitutionFromUser(user_id, institution_id) {
        return $.ajax({
            type: 'PATCH',
            url: `/api/user/${user_id}/institution/${institution_id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    }
};
