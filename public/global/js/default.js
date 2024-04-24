/*eslint-disable no-unused-vars*/
const global = {
    permissionForbidden: (text) => {
        text = text ? `<h5>${text}</h5>` : '';
        swal({
            title: 'codePACS',
            text: `Usuario no tiene Permisos para realizar esta acción. ${text} - Consulte con su Administrador`,
            type: 'warning',
            width: '40%'
        });
    },
    sendMessage: (type, message) => {
        type = type ? type : 'primary';
        $.notify({ message }, {
            type,
            z_index: 9999,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            }
        });
    },
    saveLog(users, table, id, action, comment, cb) {
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        $.ajax({
            url: '/api/logs/',
            type: 'POST',
            dataType: 'json',
            data: { users, date, table, id, action, comment }
        }).done(function(response) {
            if (cb) {
                cb(response);
            }
        });
    },
    replaceText(field) {
        let text = field;

        text = text.replace(/[,]/gi, '.');
        text = text.replace(/[']/gi, '´');
        text = text.replace(/["]/gi, '´');
        text = text.replace(/[;]/gi, '');

        return text;
    },
    unicodeEscape(str) {
        for (var charCode, index = 0, result = ''; !isNaN(charCode = str.charCodeAt(index++));) {
            result += `\\u${(`0000${charCode.toString(16)}`).slice(-4)}`;
        }
        return result;
    },
    replaceAge(field) {
        let text = field;

        text = text.replace('years', 'años');
        text = text.replace('year', 'año');
        text = text.replace('mons', 'meses');
        text = text.replace('mon', 'mes');
        text = text.replace('days', 'días');
        text = text.replace('day', 'día');

        return text;
    },
    /**
     * @param  {Array} array Arreglo de permisos del usuario
     * @param  {String} module Campo module de permisos
     * @param  {String} type Campo type de permisos
     */
    findRole(array, module, type) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].module === module && array[i].type === type) {
                return array[i];
            }
        }
        return null;
    },
    /**
     * @param {string} file Imagen cargada en Summernote
     * @param {string} path Carpeta donde se guardara el documento
     * @param {boolean} temp Estado almacenamiento temporal de imagen en servidor
     * @param {Function} cb Callback de retorno
     */
    uploadImageSummernote: (file, folder, temp, cb) => {
        data = new FormData();
        data.append('file', file);
        data.append('folder', folder);
        data.append('temp', temp);
        $.ajax({
            url: '/api/uploads/summernote',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false
        }).done(function(response) {
            cb(response);
        });
    },
    /**
     * @param {Object} info Objecto que contiene el id de calendar o paciente cuando corresponda. EJ: info.calendar o  info.patient
     * @param {string} info.calendar Pk del agendamiento
     * @param {string} info.patient Pk del paciente
     * @param {string} path Carpeta donde se guardara el documento
     * @param {string} base64 Texto que contiene el base64 de la imagen
     * @param {Function} cb Callback de retorno
     */
    uploadImageBase64: (study, path, base64, cb) => {
        base64 = base64.replace(/^data:image\/png;base64,/, '');
        const body = {
            study,
            path,
            base64
        };
        $.ajax({
            type: 'POST',
            url: '/api/uploads/base64',
            data: body,
            dataType: 'json',
            success: function(response) {
                if (cb) {
                    cb(response);
                }
            }
        });
    },
    openLoadingModal() {
        $('#divLoading').removeClass('d-none');
    },
    closeLoadingModal() {
        $('#divLoading').addClass('d-none');
    },
    openModalPassword() {
        let id = globalCredentials.id;
        let Password = new PasswordModule({ pk: id, zindex: 4444 });
        Password.on('save', function(data) {});
    },
    getAge(birthdate) {
        let age;
        if (birthdate !== '' && birthdate) {
            const years = moment().diff(birthdate, 'years');
            const months = moment().diff(moment(birthdate).add(years, 'years'), 'months');
            age = `${years} años, ${months} meses`;
        }
        return age;
    },
    generateToken(obj) {
        return $.ajax({
            type: 'POST',
            url: '/api/helpers/token',
            data: JSON.stringify({ obj }),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    }
};
