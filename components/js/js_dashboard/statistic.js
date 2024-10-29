/* statistic.js */

document.addEventListener('DOMContentLoaded', function () {
    const ctxAge = document.getElementById('ageDistributionChart').getContext('2d');
    const ageDistributionChart = new Chart(ctxAge, {
        type: 'bar',
        data: {
            labels: ['< 10 Jahre', '10-20 Jahre', '20-30 Jahre', '30-40 Jahre', '> 40 Jahre'],
            datasets: [{
                label: 'Anzahl der Bäume',
                data: [150, 200, 120, 80, 60],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctxSpecies = document.getElementById('speciesDistributionChart').getContext('2d');
    const speciesDistributionChart = new Chart(ctxSpecies, {
        type: 'doughnut',
        data: {
            labels: ['Eiche', 'Linde', 'Ahorn', 'Buche', 'Kastanie'],
            datasets: [{
                label: 'Artenverteilung',
                data: [120, 150, 100, 80, 50],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const ctxHealth = document.getElementById('healthConditionChart').getContext('2d');
    const healthConditionChart = new Chart(ctxHealth, {
        type: 'pie',
        data: {
            labels: ['Gesund', 'Krank', 'Gefährdet', 'Toter Baum'],
            datasets: [{
                label: 'Gesundheitszustand',
                data: [200, 50, 30, 10],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(201, 203, 207, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});