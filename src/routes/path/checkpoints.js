const Boom = require('@hapi/boom');
const { parse } = require('handlebars');

module.exports = [
    {
        method: 'GET',
        path: '/record',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="630bd411f319363de1d4335e"', title: 'ANTECEDENTES' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/environmentTerrain',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294bf0f4a12f7451a7f0752"', title: 'ENTORNO Y TERRENO' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/ergonomics',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="63d039ff284f964eff461176"', title: 'ERGONOMÍA' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/electricalGasInstallations',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294bf7f4a12f7451a7f0753"', title: 'INSTALACIONES ELÉCTRICAS Y GAS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/sanitaryInstallations',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294bf9b4a12f7451a7f0754"', title: 'INSTALACIONES SANITARIAS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/physicalPlant',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294bfc14a12f7451a7f0755"', title: 'PLANTA FÍSICA' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/illumination',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="630c33e9f319363de1d4337f"', title: 'ILUMINACIÓN' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/orderCleanliness',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294bfd64a12f7451a7f0756"', title: 'ORDEN Y ASEO' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/access',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294bff64a12f7451a7f0757"', title: 'ACCESOS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/circulationCrosswalk',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c00b4a12f7451a7f0758"', title: 'CIRCULACIÓN Y CRUCES PEATONALES' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/parkingLots',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' || request.auth.credentials.role.name === 'ADMINISTRADOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0264a12f7451a7f0759"', title: 'ESTACIONAMIENTOS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/signalingTransit',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0384a12f7451a7f075a"', title: 'SEÑALIZACIÓN Y TRANSITO' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/kitchens',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0474a12f7451a7f075b"', title: 'COCINAS. PLATOS PREPARADOS QUE REQUIEREN O NO COCCIÓN' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/firstAid',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0664a12f7451a7f075c"', title: 'PRIMEROS AUXILIOS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/fireSafety',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0804a12f7451a7f075d"', title: 'SEGURIDAD CONTRA INCENDIOS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/escapeRoutes',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0924a12f7451a7f075e"', title: 'VÍAS DE ESCAPE' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/games',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="630c361cf319363de1d43383"', title: 'JUEGOS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/lab',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0b84a12f7451a7f075f"', title: 'LABORATORIO' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/teachingTechnicalProfessionalPerson',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0c74a12f7451a7f0760"', title: 'EPP ENSEÑANZA TÉCNICO PEROFESIONAL - PERSONAS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    }, {
        method: 'GET',
        path: '/auditLey16744',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c10c4a12f7451a7f0762"', title: 'AUDITORIA ORGANISMO ADMINISTRADOR LEY 16.744' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/teachingTechnicalProfessionalMachinery',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c0d94a12f7451a7f0761"', title: 'EPP ENSEÑANZA TÉCNICO PEROFESIONAL - MAQUINARIAS' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/protocolTMERT',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c11a4a12f7451a7f0763"', title: 'PROTOCOLO TMERT' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/protocolMMC',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c12a4a12f7451a7f0764"', title: 'PROTOCOLO MMC' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/vocalEffortProtocol',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c1384a12f7451a7f0765"', title: 'PROTOCOLO ESFUERZO VOCAL' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/uvRadiationProtocol',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c1484a12f7451a7f0766"', title: 'PROTOCOLO RADIACIÓN UV' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/psychosocialProtocol',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'subcategory="6294c1574a12f7451a7f0767"', title: 'PROTOCOLO PSICOSOCIAL' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/emergencyPlan',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'category="6294bd824a12f7451a7f0749"', title: 'PLAN INTEGRAL DE SEGURIDAD ESCOLAR' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/schoolBrigade',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR' ||
                    request.auth.credentials.role.name === 'BRIGADA ESCOLAR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'category="635bf5dbec42b8735487e1b1"', title: 'BRIGADA ESCOLAR' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/parityGroup',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR' ||
                    request.auth.credentials.role.name === 'COMITÉ PARITARIO') {
                    return h.view('app/checkpoints', { subCategoryPk: 'category="6294bd9d4a12f7451a7f074a"', title: 'COMITÉ PARITARIO' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/securityMonitor',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR' ||
                    request.auth.credentials.role.name === 'MONITOR DE SEGURIDAD') {
                    return h.view('app/checkpoints', { subCategoryPk: 'category="6294bdb74a12f7451a7f074b"', title: 'MONITOR DE SEGURIDAD' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/covid19',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'category="6294bdda4a12f7451a7f074c"', title: 'COVID-19' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/miper',
        options: {
            handler: async function (request, h) {
                if (request.auth.credentials.role.name === 'AUDITOR' ||
                    request.auth.credentials.role.name === 'ADMINISTRADOR' ||
                    request.auth.credentials.role.name === 'GESTOR') {
                    return h.view('app/checkpoints', { subCategoryPk: 'category="630cd36bf319363de1d4338b"', title: 'MIPER' });
                } else {
                    return h.redirect('/404');
                }
            }
        }
    }
];
