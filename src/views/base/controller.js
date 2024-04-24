controller = {
    validateForm(cb) {
        var err = false;
        $('.crud-form :input').each(function(index, element) {
            if (String($(element).attr('required')) === 'required') {
                if (!$(element).val() || $(element).val() === null || $(element).val() === '') {
                    $(element).parent().addClass('has-error');
                    err = true;
                } else if ($(element).attr('type') === 'email') {
                    if (!controller.validateEmail($(element).val())) {
                        $(element).parent().addClass('has-error');
                        err = true;
                    }
                }
            }
        });
        if (cb) {
            cb(err);
        }
    },
    saveData() {

    },
    updateData() {

    },
    validateEmail() {
        var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if (filter.test(sEmail)) {
            return true;
        }
        return false;
    },
    resetFormInputs(cb) {
        $('.crud-form :input').each((index, el) => {
            $(el).val('');
            $(el).parent().removeClass('has-error');
        });
    }
};