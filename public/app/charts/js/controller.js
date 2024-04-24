let controller = {
    async loadAccidents() {
        const accidents = await this.getAccidents();
        $('#accidents').empty();
        accidents.map(accident => {
            $('#accidents').append(`<option value="${accident}">${accident}</option>`);
        });
    },
    async loadLostDays() {
        const typeAccident = ['ACCIDENTE', 'ACCIDENTE ESCOLAR'];
        $('#lostDays').empty();
        typeAccident.map(accident => {
            $('#lostDays').append(`<option value="${accident}">${accident}</option>`);
        });
    },
    async loadYears() {
        const years = await this.getYearsByAccident();
        years.sort((a, b) => b - a);
        $('#yearsWorkAccident').empty();
        $('#yearsSchoolAccident').empty();
        years.map(year => {
            $('#yearsWorkAccident').append(`<option value="${year}">${year}</option>`);
            $('#yearsSchoolAccident').append(`<option value="${year}">${year}</option>`);
        });
    },
    async listYearsByAccident() {
        const years = await this.getYearsByAccident();
        return years;
    },
    async listQuantityByAccidentName(selectAccident, accidentYears) {
        const quantity = await this.getQuantityByAccidentName(selectAccident, accidentYears);
        return quantity;
    },
    async listQuantityBySelectLostDays(typeAccident, lostDaysYears) {
        const quantity = await this.getQuantityBySelectLostDays(typeAccident, lostDaysYears);
        return quantity;
    },
    async listQuantityWorkAccidentCaseByYear(year) {
        const quantity = await this.getQuantityWorkAccidentCaseByYear(year);
        return quantity;
    },
    async listQuantitySchoolAccidentCaseByYear(year) {
        const quantity = await this.getQuantitySchoolAccidentCaseByYear(year);
        return quantity;
    },
    getQuantitySchoolAccidentCaseByYear(year) {
        return $.ajax({
            type: 'GET',
            url: `/api/accident/QuantitySchoolAccidentCaseByYear/${year}`,
            dataType: 'json'
        });
    },
    getQuantityWorkAccidentCaseByYear(year) {
        return $.ajax({
            type: 'GET',
            url: `/api/accident/QuantityWorkAccidentCaseByYear/${year}`,
            dataType: 'json'
        });
    },
    getQuantityBySelectLostDays(typeAccident, lostDaysYears) {
        return $.ajax({
            type: 'GET',
            url: `/api/accident/QuantityBySelectLostDays/${typeAccident}/${lostDaysYears}`,
            dataType: 'json'
        });
    },
    getQuantityByAccidentName(type, accidentYears) {
        return $.ajax({
            type: 'GET',
            url: `/api/accident/QuantityByAccidentName/${type}/${accidentYears}`,
            dataType: 'json'
        });
    },
    getYearsByAccident() {
        return $.ajax({
            type: 'GET',
            url: `/api/accident/yearsByAccident`,
            dataType: 'json'
        });
    },
    getAccidents() {
        return $.ajax({
            type: 'GET',
            url: '/api/accident/listGroup',
            dataType: 'json'
        });
    }
};
