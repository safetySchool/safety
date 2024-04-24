$(document).ready(function () {
    jQuery('body').bind('focusin focus', function (e) {
        e.preventDefault();
    });
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };
    $('#btnSave').click(function (e) {
        e.preventDefault();
        if ($('#survey').parsley(parselyOptions).validate()) {
            let surveyResponses = [];
            let questions = $('.question');
            for (const question of questions) {
                let type = $(question).attr('data-type');
                if (type === 'multi-select') {
                    let questionValues = [];
                    let id = $(question).attr('data-id');
                    let options = $(question).find(`[name="${id}[]"]`);
                    for (const option of options) {
                        if ($(option).is(':checked')) {
                            if ($(option).hasClass('valueFromInput')) {
                                let value = $(option).next().next().val() || $(option).attr('data-value');
                                questionValues.push(value);
                            } else {
                                questionValues.push($(option).attr('data-value'));
                            }
                        }
                    }
                    surveyResponses.push({ id, value: questionValues || null });
                } else if (type === 'single-select') {
                    let id = $(question).attr('data-id');
                    let value = $(question).children().find('.custom-control-input:radio:checked').attr('data-value');
                    surveyResponses.push({ id, value: value || null });
                } else if (type === 'number') {
                    if (!$(question).hasClass('d-none')) {
                        let nested = $(question).hasClass('question-nested');
                        let value = $(question).find('input').val();
                        let id = $(question).attr('data-id');
                        surveyResponses.push({ id, value: value || null, nested });
                    }
                } else if (type === 'text') {
                    if (!$(question).hasClass('d-none')) {
                        let nested = $(question).hasClass('question-nested');
                        let value = $(question).find('input').val();
                        let id = $(question).attr('data-id');
                        surveyResponses.push({ id, value: value || null, nested });
                    }
                }
            }
            const surveyGraduate = $('#survey').attr('data-surveyGraduate');
            controller.handleSaveAnswers({ surveyGraduate, surveyResponses }).then();
        }
    });
    $('.custom-control-input').change(function () {
        let isQuestionNested = $(this).parent().parent().attr('data-nested') ? JSON.parse($(this).parent().parent().attr('data-nested')) : false;
        let nested = $(this).attr('data-nested') ? JSON.parse($(this).attr('data-nested')) : false;
        if (nested) {
            $(this).parent().parent().parent().parent().next().attr('data-show', true).removeClass('d-none');
            $(this).parent().parent().parent().parent().next().find('input').prop('required', true);
        } else if (isQuestionNested) {
            $(this).parent().parent().parent().parent().next().attr('data-show', false).addClass('d-none');
            $(this).parent().parent().parent().parent().next().find('input').prop('required', false);
        }
    });
    $('.valueFromInput').change(function () {
        if ($(this).is(':checked')) {
            $(this).next().next().removeClass('d-none');
        } else {
            $(this).next().next().addClass('d-none');
        }
    });
    $('.onlyNumber').on('keypress', function (e) {
        // Ensure that it is a number and stop the keypress
        if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) {
            e.preventDefault();
        }
    });
});
