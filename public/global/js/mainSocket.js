$(".nav-item a").each(function () {
    const pageUrl = window.location.href.split(/[?#]/)[0];
    if (this.href === pageUrl) {
        $(this).addClass("active");
    }
});
if (globalCredentials) {
    //const user = globalCredentials.pk;

    var socketGlobal = io.connect({ transports: ['websocket'] });
    socketGlobal.on('connect', function() {
        socketGlobal.on('chat', function(server) {
            if (typeof $studyChat !== 'undefined') {
                if (server.message.type === 'typing') {
                    if (($studyChat.data('bs.modal') || {}).isShown) {
                        var study = $('#btnSaveComment').attr('data-study');
                        if (parseInt(study) === parseInt(server.message.study)) {
                            $('#info-typing').html(`<b>${server.message.username}</b> está escribiendo <label class="ellipsis-chat">...</label>`);
                        }
                    }
                } else if (server.message.type === 'leave-typing') {
                    if (($studyChat.data('bs.modal') || {}).isShown) {
                        var study = $('#btnSaveComment').attr('data-study');
                        if (parseInt(study) === parseInt(server.message.study)) {
                            $('#info-typing').empty();
                        }
                    }
                } else if (server.message.type === 'createComment') {
                    if (($studyChat.data('bs.modal') || {}).isShown) {
                        var study = $('#btnSaveComment').attr('data-study');
                        if (parseInt(study) === parseInt(server.message.study)) {
                            controller.loadCommentModal(server.message.study, false);
                            $('#info-typing').empty();
                        }
                    }
                    controller.updateCellComment(server.message.study, server.message.count);
                }
            }
        });
        socketGlobal.on('report', function(server) {
            if (server.message.type === 'openModule') {
                if ($('#modal-report').hasClass('show')) {
                    var study = $('#study-data').attr('data-study');
                    if (parseInt(server.message.study) === parseInt(study)) {
                        socketGlobal.emit('report', { type: 'closeModule', user: server.message.user, message: 'Este estudio está siendo informado por otro radiologo en estos momentos' });
                    }
                }
            } else if (server.message.type === 'closeModule') {
                if (parseInt(server.message.user) === parseInt(globalCredentials.pk)) {
                    Swal.fire({ icon: 'error', title: 'Atención', text: server.message.message });
                    setTimeout(() => {
                        $('#modal-report').modal('hide');
                    }, 500);
                }
            }
        });
    });
}
