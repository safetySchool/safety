let firstInitPassword = true;

class PasswordModule {
    constructor(props) {
        let { pk, zindex } = props;

        this.pk = pk;
        this.dispatchHandlers = [];
        if (zindex) {
            $('#modal-password').css('z-index', zindex);
        }

        let fileOptions = {};

        if (firstInitPassword) {
            firstInitPassword = false;
            this.ready(fileOptions);
        } else {
            this.rebuild(fileOptions);
        }
        this.init();
    }
    ready(fileOptions) {
        mainPasswordModule(this, fileOptions);
    }
    rebuild(fileOptions) {
        /* $('#upload-files-input').fileinput('destroy').fileinput(fileOptions); */
    }
    init() {
        const self = this;
        self.openModal();
    }
    // Método
    openModal() {
        $('#modal-password').modal({ backdrop: 'static', keyboard: false });
    }
    handleError() {
        /* swal({ title: '<b>ERROR</b>', html: 'Ocurrió un problema al subir archivos. Favor contacte a su administrador', type: 'error' });
        console.error('Los campos pk, table y subDirectory son requeridos. Revisar la invocación al módulo upload'); */
    }
}
PasswordModule.prototype.on = function(eventName, handler) {
    if (this.dispatchHandlers) {
        switch (eventName) {
            case 'save':
                return this.dispatchHandlers.push(handler);
        }
    }
};

PasswordModule.prototype.notify = function(data) {
    data.uploaded = true;
    if (this.dispatchHandlers) {
        let handler, i, len, ref;
        ref = this.dispatchHandlers;
        for (i = 0, len = ref.length; i < len; i++) {
            handler = ref[i];
            handler(data);
        }
    }
};
PasswordModule.prototype.notifyCancel = function() {
    if (this.dispatchHandlers) {
        let handler, i, len, ref;
        ref = this.dispatchHandlers;
        for (i = 0, len = ref.length; i < len; i++) {
            handler = ref[i];
            handler({ uploaded: false });
        }
    }
};
