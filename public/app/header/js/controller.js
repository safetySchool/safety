let controllerInstitutions = {
    async loadInstitutions(institutionSelected) {
        const userId = globalCredentials._id;
        const user = await this.getInstitutions(userId);
        const institutions = user.institution;
        $('#institutions').empty();
        for (const institution of institutions) {
            $('#institutions').append(`<option value="${institution._id}">${institution.name}</option>`);
        }
        // seleccionar la institucion que tenga el valor de institution
        $('#institutions').val('' + institutionSelected);
    },
    getInstitutions(userId) {
        return $.ajax({
            type: 'GET',
            url: `/api/users-institutionName/${userId}`,
            dataType: 'json'
        });
    },
    getPercentageComplianceCategory() {
        return $.ajax({
            url: '/api/percentage_compliance_categories',
            type: 'GET'
        });
    },
    getPercentageComplianceSubcategories() {
        return $.ajax({
            url: '/api/percentage_compliance_subcategories',
            type: 'GET'
        });
    }
};
