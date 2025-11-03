export class NavigationManager {
    constructor() {
        this.currentSection = 'project-info';
        this.sections = [
            'project-info',
            'design-conditions', 
            'local-geology',
            'building-importance',
            'structural-config',
            'reduction-factor',
            'vibration-period',
            'calculation-summary',
            'design-spectrum'
        ];
    }
    
    showSection(sectionId) {
        // Ocultar todas las secciones
        this.sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) element.classList.remove('active');
        });
        
        // Mostrar sección actual
        const currentElement = document.getElementById(sectionId);
        if (currentElement) {
            currentElement.classList.add('active');
            this.currentSection = sectionId;
        }
        
        // Actualizar navegación
        this.updateNavigation(sectionId);
    }
    
    updateNavigation(activeSection) {
        // Actualizar items de navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === activeSection) {
                item.classList.add('active');
            }
        });
    }
    
    next() {
        const currentIndex = this.sections.indexOf(this.currentSection);
        if (currentIndex < this.sections.length - 1) {
            this.showSection(this.sections[currentIndex + 1]);
        }
    }
    
    previous() {
        const currentIndex = this.sections.indexOf(this.currentSection);
        if (currentIndex > 0) {
            this.showSection(this.sections[currentIndex - 1]);
        }
    }
}