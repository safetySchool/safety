$(async function () {
    await controller.loadAccidents();
    await controller.loadLostDays();
    await controller.loadYears();

    // AccidentsChart initialization
    const selectAccident = $('#accidents').val();
    const accidetsYears = await controller.listYearsByAccident();
    const quantityAccidents = await controller.listQuantityByAccidentName(selectAccident, accidetsYears);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
        'Octubre', 'Noviembre', 'Diciembre'
    ];
    const ctx = document.getElementById('AccidentsChart');
    const AccidentsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: quantityAccidents
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        }
                    }
                }
            }
        }
    });

    // LostDaysChart initialization
    const typeAccident = $('#lostDays').val();
    const quantityLostDays = await controller.listQuantityBySelectLostDays(typeAccident, accidetsYears);

    const ctx2 = document.getElementById('LostDaysChart');
    const LostDaysChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: months,
            datasets: quantityLostDays
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        }
                    }
                }
            }
        }
    });

    // WorkAccidentCaseChart initialization
    const yearsWorkAccident = $('#yearsWorkAccident').val();
    const quantityWorkAccidentCase = await controller.listQuantityWorkAccidentCaseByYear(yearsWorkAccident);
    const casuistries = ['Caída', 'Golpe', 'Quemadura', 'Contacto con', 'Proyección de patículas',
        'Sobreesfuerzo', 'Colisión Vehicular', 'Atropello', 'Riña', 'Otros'];

    const ctx3 = document.getElementById('WorkAccidentCaseChart');
    const WorkAccidentCaseChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: casuistries,
            datasets: quantityWorkAccidentCase
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 10,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'sans-serif',
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                    }
                }
            }
        }
    });

    // SchoolAccidentsCaseChart initialization
    const yearsSchoolAccident = $('#yearsSchoolAccident').val();
    const quantitySchoolAccidentCase = await controller.listQuantitySchoolAccidentCaseByYear(yearsSchoolAccident);

    const ctx4 = document.getElementById('SchoolAccidentsCaseChart');
    const SchoolAccidentsCaseChart = new Chart(ctx4, {
        type: 'doughnut',
        data: {
            labels: casuistries,
            datasets: quantitySchoolAccidentCase
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        padding: 10,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            family: 'sans-serif',
                            weight: 'bold',
                            lineHeight: 1.2,
                        },
                    }
                }
            }
        }
    });

    $('#yearsWorkAccident').on('change', async function () {
        const year = $('#yearsWorkAccident').val();
        const quantityWorkAccidentCase = await controller.listQuantityWorkAccidentCaseByYear(year);

        WorkAccidentCaseChart.data.datasets = quantityWorkAccidentCase;
        WorkAccidentCaseChart.update();
    });

    $('#yearsSchoolAccident').on('change', async function () {
        const year = $('#yearsSchoolAccident').val();
        const quantitySchoolAccidentCase = await controller.listQuantitySchoolAccidentCaseByYear(year);

        SchoolAccidentsCaseChart.data.datasets = quantitySchoolAccidentCase;
        SchoolAccidentsCaseChart.update();
    });

    $('#accidents').on('change', async function () {
        const selectAccident = $('#accidents').val();
        const accidetsYears = await controller.listYearsByAccident();
        const quantityAccidents = await controller.listQuantityByAccidentName(selectAccident, accidetsYears);

        AccidentsChart.data.labels = months;
        AccidentsChart.data.datasets = quantityAccidents;
        AccidentsChart.update();
    });

    $('#lostDays').on('change', async function () {
        const selectAccident = $('#lostDays').val();
        const accidetsYears = await controller.listYearsByAccident();
        const quantityAccidents = await controller.listQuantityBySelectLostDays(selectAccident, accidetsYears);

        LostDaysChart.data.labels = months;
        LostDaysChart.data.datasets = quantityAccidents;
        LostDaysChart.update();
    });
});

