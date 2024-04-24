// eslint-disable-next-line no-unused-vars
let controller = {
    list_regions_provinces_communes() {
        return $.ajax({
            type: 'GET',
            url: '/api/institution2/RegionsProvincesCommunes',
            dataType: 'json'
        });
    },
    openLogo(logo) {
        // Get the modal
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("img01");
        modal.style.display = "block";
        modalImg.src = logo;
        // captionText.innerHTML = this.alt;
        const span = document.getElementById("closeModal");
        span.onclick = function () {
            modal.style.display = "none";
        }
    },
    saveItem(data) {
        return $.ajax({
            type: 'POST',
            url: '/api/institution2',
            data: data,
            dataType: 'json'
        });
    },
    updateItem(data) {
        const {
            _id,
            name,
            region,
            province,
            commune,
            address,
            active,
            phone_number_institution,
            email_institution,
            maps_link
        } = data;
        return $.ajax({
            type: 'PATCH',
            url: '/api/institution2',
            data: {
                _id,
                name,
                region,
                province,
                commune,
                address,
                active,
                phone_number_institution,
                email_institution,
                maps_link
            },
            dataType: 'json'
        });
    }
};
