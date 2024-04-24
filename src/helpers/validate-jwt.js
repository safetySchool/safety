module.exports = validate = async function(decoded, request) {

    // ESTA VALIDACIÓN SE COMPROBARÁ CON LA DB MÁS ADELANTE
    if (decoded.name === 'CODESUD-API') {
        return { isValid: true };
    }
    return { isValid: false };
};
