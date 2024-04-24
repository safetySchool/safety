$(document).ready(function() {
    $('#btnAdd').click(function(e) {
        e.preventDefault();
        $('#crud-modal').modal('show');
    });
    $('#btnEdit').click(function(e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().length > 0) {
            const row = datatable.rows({ selected: true }).data().toArray()[0].pk;
            console.log(row);
        }
    });
    $('#btnDelete').click(function(e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().length > 0) {
            const row = datatable.rows({ selected: true }).data().toArray()[0].pk;
            console.log(row);
        }
    });
    $('#saveButton').click(function(e) {
        e.preventDefault();
        controller.validateForm(function(err) {
            console.log(err);
        });
    });
    $('#crud-modal').on('hidden.bs.modal', function() {
        controller.resetFormInputs();
    });
    $('.crud-form :input').click(function() {
        $(this).parent().removeClass('has-error');
    });
});