let findRole;

const findObjectByKey = function (array, module, type) {
    if (array) {
        if (array === module) {
            return array;
        }
    }
    return null;
};
findRole = function (permissions, module, type, context) {
    const obj = findObjectByKey(permissions, module, type);
    if (obj) {
        return context.fn(this);
    }
    return context.inverse(this);
};


// const findObjectByKey = function(array, module, type) {
//     if (array) {
//         for (let i = 0; i < array.length; i++) {
//             if (array[i].module === module && array[i].type === type) {
//                 return array[i];
//             }
//         }
//     }
//     return null;
// };
// findRole = function(permissions, module, type, context) {
//     const obj = findObjectByKey(permissions, module, type);
//     if (obj) {
//         return context.fn(this);
//     }
//     return context.inverse(this);
// };

module.exports = findRole;
