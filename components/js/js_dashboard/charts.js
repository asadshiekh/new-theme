document.addEventListener("DOMContentLoaded", () => {
    // Example Chart for Tree Care Status
    const treeCareCtx = document.getElementById('treeCareChart').getContext('2d');
    const treeCareChart = new Chart(treeCareCtx, {
        type: 'pie',
        data: {
            labels: ['Gesunde Bäume', 'Bäume in Pflege', 'Gefällte Bäume'],
            datasets: [{
                data: [50, 30, 20],
                backgroundColor: ['#76c7c0', '#ffce56', '#ff6384']
            }]
        }
    });

    // Example Chart for Tree Age Statistics
    const ageCtx = document.getElementById('ageChart').getContext('2d');
    const ageChart = new Chart(ageCtx, {
        type: 'bar',
        data: {
            labels: ['< 10 Jahre', '10-25 Jahre', '> 25 Jahre'],
            datasets: [{
                label: 'Anzahl der Bäume',
                data: [3000, 5000, 1230],
                backgroundColor: '#76c7c0'
            }]
        }
    });
});
