$(function () {
    const institutionSelected = globalCredentials.institution;
    controllerInstitutions.loadInstitutions(institutionSelected).then(r => console.log(r));
});

function institutionsOnchange() {
    const institutionId = $('#institutions').val();
    const data = globalCredentials;
    globalCredentials.institution = institutionId;
    // PATH /login/validate POR POST Y ENVIA EL OBJETO globalCredentials
    $.ajax({
        type: 'POST',
        url: '/login/validate',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (data) {
            console.log("data: ", data);
        },
        error: function (error) {
            console.log("error: ", error);
            location.reload();
        }
    });

}

async function get_percentage_compliance() {
    const categories = await controllerInstitutions.getPercentageComplianceCategory();
    const subcategories = await controllerInstitutions.getPercentageComplianceSubcategories();

    categories.forEach(category => {
        const name = category.name
            .replace(/ /g, '_')
            .replace(/\./g, '_')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/_+/g, '_');

        const percentage = category.percentage;

        $(`#${name}`).text(percentage);
    });

    subcategories.forEach(subcategory => {

        const name = subcategory.name
            .replace(/ /g, '_')
            .replace(/\./g, '_')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/_+/g, '_');

        const percentage = subcategory.percentage;

        $(`#${name}`).text(percentage);
    });
}

get_percentage_compliance();