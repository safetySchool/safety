/**
 * Llamada Ajax en Promise
 * @param {number} method Metodo utilizado en la llamada EJ. POST, DELETE, GET, etc
 * @param {number} url Url a consumir
 * @param {Object} body Objeto con parametros a enviar al EndPoint
 * @returns {Object}
 */
window.doAjax = async function(method, url, body) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(body),
            dataType: 'json',
            success: function(response) {
                resolve(response);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
};
