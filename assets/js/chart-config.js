export class SpectrumChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.chart = null;
        this.colors = {
            elastic: '#e74c3c',
            reduced: '#3498db'
        };
    }
    
    initialize() {
        const ctx = this.canvas.getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Espectro Elástico',
                        borderColor: this.colors.elastic,
                        backgroundColor: this.colors.elastic + '20',
                        borderWidth: 3,
                        fill: true,
                        tension: 0
                    },
                    {
                        label: 'Espectro Reducido',
                        borderColor: this.colors.reduced,
                        backgroundColor: this.colors.reduced + '20', 
                        borderWidth: 3,
                        fill: true,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Periodo (s)'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Aceleración (g)'
                        },
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Espectros de Diseño - NEC-15',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }
    
    updateData(spectrumData) {
        if (!this.chart) return;
        
        this.chart.data.labels = spectrumData.map(point => point.period.toFixed(2));
        this.chart.data.datasets[0].data = spectrumData.map(point => point.elastic);
        this.chart.data.datasets[1].data = spectrumData.map(point => point.reduced);
        this.chart.update();
    }
    
    updateColors(elasticColor, reducedColor) {
        this.colors.elastic = elasticColor;
        this.colors.reduced = reducedColor;
        
        if (this.chart) {
            this.chart.data.datasets[0].borderColor = elasticColor;
            this.chart.data.datasets[0].backgroundColor = elasticColor + '20';
            this.chart.data.datasets[1].borderColor = reducedColor;
            this.chart.data.datasets[1].backgroundColor = reducedColor + '20';
            this.chart.update();
        }
    }
    
    exportAsImage() {
        return this.chart.toBase64Image();
    }
}