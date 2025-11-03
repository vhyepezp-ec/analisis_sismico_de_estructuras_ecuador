class ExportManager {
    constructor() {
        this.pdf = null;
    }
    
    // Exportar a PDF
    async exportToPDF(projectData, results, spectrumData) {
        const { jsPDF } = window.jspdf;
        this.pdf = new jsPDF();
        
        // Portada
        this.addCoverPage(projectData);
        this.pdf.addPage();
        
        // Parámetros de sitio
        this.addSiteParameters(projectData.site);
        this.pdf.addPage();
        
        // Factores estructurales  
        this.addStructuralFactors(projectData.structural);
        this.pdf.addPage();
        
        // Resultados
        this.addResults(results);
        this.pdf.addPage();
        
        // Espectro de diseño
        this.addSpectrumChart(spectrumData);
        
        // Guardar PDF
        this.pdf.save(`Reporte_NEC15_${projectData.name}_${Date.now()}.pdf`);
    }
    
    // Exportar a Excel
    exportToExcel(projectData, results, spectrumData) {
        const wb = XLSX.utils.book_new();
        
        // Hoja de parámetros
        const paramsSheet = XLSX.utils.json_to_sheet([
            { 'Parámetro': 'Valor', 'Descripción': 'Unidad' },
            { 'Parámetro': 'Nombre del Proyecto', 'Valor': projectData.name, 'Descripción': '', 'Unidad': '' },
            { 'Parámetro': 'Altura', 'Valor': projectData.height, 'Descripción': 'Altura del edificio', 'Unidad': 'm' },
            // ... más parámetros
        ]);
        XLSX.utils.book_append_sheet(wb, paramsSheet, "Parámetros");
        
        // Hoja de espectro
        const spectrumSheet = XLSX.utils.json_to_sheet(spectrumData);
        XLSX.utils.book_append_sheet(wb, spectrumSheet, "Espectro");
        
        // Guardar Excel
        XLSX.writeFile(wb, `Datos_NEC15_${projectData.name}_${Date.now()}.xlsx`);
    }
    
    addCoverPage(projectData) {
        this.pdf.setFontSize(20);
        this.pdf.text('REPORTE SÍSMICO NEC-15', 105, 50, { align: 'center' });
        this.pdf.setFontSize(16);
        this.pdf.text(`Proyecto: ${projectData.name}`, 105, 80, { align: 'center' });
        this.pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 105, 100, { align: 'center' });
    }
    
    // ... más métodos para exportación ...
}