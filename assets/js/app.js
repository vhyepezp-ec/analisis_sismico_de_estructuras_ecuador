class NEC15App {
    constructor() {
        this.currentProject = {};
        this.results = {};
        this.navigation = new NavigationManager();
        this.calculator = new SeismicCalculator();
        this.chart = new SpectrumChart('spectrumChart');
        this.exportManager = new ExportManager();
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.setupEventListeners();
        this.loadDefaultValues();
        this.generateDynamicContent();
        this.calculateAll();
    }
    
    setupEventListeners() {
        // Navegación
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigation.showSection(item.dataset.target);
            });
        });
        
        // Cambios en formularios
        document.getElementById('project-name').addEventListener('input', () => this.calculateAll());
        document.getElementById('building-height').addEventListener('input', () => this.calculateAll());
        document.getElementById('tx').addEventListener('input', () => this.calculateAll());
        document.getElementById('ty').addEventListener('input', () => this.calculateAll());
        document.getElementById('seismic-weight').addEventListener('input', () => this.calculateAll());
        
        // Botones de navegación
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-next')) {
                this.navigation.next();
            } else if (e.target.classList.contains('btn-prev')) {
                this.navigation.previous();
            }
        });
    }
    
    generateDynamicContent() {
        this.generateDesignConditions();
        this.generateLocalGeology();
        this.generateBuildingImportance();
        this.generateStructuralConfig();
        this.generateReductionFactor();
        this.generateVibrationPeriod();
        this.generateCalculationSummary();
        this.generateDesignSpectrum();
    }
    
    generateDesignConditions() {
        const section = document.getElementById('design-conditions');
        section.innerHTML = `
            <h2 class="section-title">Condiciones de Diseño</h2>
            
            <div class="card">
                <h3>Zonificación Sísmica</h3>
                <div class="form-group">
                    <label for="seismic-zone">Zona Sísmica</label>
                    <select id="seismic-zone">
                        <option value="VI">Zona VI</option>
                        <option value="V" selected>Zona V</option>
                        <option value="IV">Zona IV</option>
                        <option value="III">Zona III</option>
                        <option value="II">Zona II</option>
                        <option value="I">Zona I</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="region">Región</label>
                    <select id="region">
                        <option value="sierra" selected>Sierra, Esmeraldas y Galápagos</option>
                        <option value="costa">Costa</option>
                        <option value="oriente">Oriente</option>
                    </select>
                </div>
                
                <div class="results-grid">
                    <div class="result-item">
                        <label>Aceleración de la zona sísmica (Z)</label>
                        <div class="factor-value" id="z-value">0.4</div>
                    </div>
                    <div class="result-item">
                        <label>Caracterización del peligro sísmico</label>
                        <div class="factor-value" id="risk-characterization">Alta</div>
                    </div>
                    <div class="result-item">
                        <label>Relación de amplificación espectral (η)</label>
                        <div class="factor-value" id="eta-value">2.48</div>
                    </div>
                </div>
            </div>
            
            <div class="export-buttons">
                <button class="btn btn-prev">← Anterior</button>
                <button class="btn btn-next">Siguiente →</button>
            </div>
        `;
        
        // Event listeners para esta sección
        document.getElementById('seismic-zone').addEventListener('change', () => this.calculateAll());
        document.getElementById('region').addEventListener('change', () => this.calculateAll());
    }
    
    generateLocalGeology() {
        const section = document.getElementById('local-geology');
        section.innerHTML = `
            <h2 class="section-title">Geología Local</h2>
            
            <div class="card">
                <h3>Tipo de Perfil de Suelo</h3>
                <div class="form-group">
                    <label for="soil-type">Seleccione el tipo de perfil:</label>
                    <select id="soil-type">
                        <option value="A">A - Roca competente</option>
                        <option value="B">B - Roca de rigidez media</option>
                        <option value="C">C - Suelos muy densos o roca blanda</option>
                        <option value="D" selected>D - Suelos rígidos</option>
                        <option value="E">E - Suelos blandos</option>
                        <option value="F">F - Suelos especiales</option>
                    </select>
                </div>
                
                <div class="info-box">
                    <strong>Descripción:</strong> <span id="soil-description">Perfiles de suelos rígidos que cumplan con el criterio de velocidad de la onda de cortante, o Perfiles de suelos rígidos que cumplan cualquiera de las dos condiciones</span>
                    <br><br>
                    <strong>Definición:</strong> <span id="soil-definition">360 m/s > Vs ≥ 180 m/s - 50 > N ≥ 15.0 - 100 kPa > Su ≥ 50 kPa</span>
                </div>
                
                <div class="factors-grid">
                    <div class="factor-item">
                        <label>Fa</label>
                        <div class="factor-value" id="fa-value">1.2</div>
                        <small>Factor de amplificación</small>
                    </div>
                    <div class="factor-item">
                        <label>Fd</label>
                        <div class="factor-value" id="fd-value">1.19</div>
                        <small>Factor de desplazamiento</small>
                    </div>
                    <div class="factor-item">
                        <label>Fs</label>
                        <div class="factor-value" id="fs-value">1.28</div>
                        <small>Factor inelástico</small>
                    </div>
                </div>
            </div>
            
            <div class="export-buttons">
                <button class="btn btn-prev">← Anterior</button>
                <button class="btn btn-next">Siguiente →</button>
            </div>
        `;
        
        document.getElementById('soil-type').addEventListener('change', () => this.calculateAll());
    }
    
    // ... métodos similares para las otras secciones ...
    
    collectInputData() {
        this.currentProject = {
            name: document.getElementById('project-name').value || 'Proyecto 1',
            height: parseFloat(document.getElementById('building-height').value) || 11.31,
            tx: parseFloat(document.getElementById('tx').value) || 1,
            ty: parseFloat(document.getElementById('ty').value) || 1,
            weight: parseFloat(document.getElementById('seismic-weight').value) || 1,
            zone: document.getElementById('seismic-zone').value || 'V',
            region: document.getElementById('region').value || 'sierra',
            soil: document.getElementById('soil-type').value || 'D',
            importance: this.getSelectedImportance(),
            phiP: this.getSelectedPhiP(),
            phiE: this.getSelectedPhiE(),
            reduction: this.getSelectedReduction(),
            structuralType: this.getSelectedStructuralType()
        };
    }
    
    calculateAll() {
        this.collectInputData();
        this.updateDesignConditions();
        this.updateLocalGeology();
        this.performCalculations();
        this.updateResults();
    }
    
    updateDesignConditions() {
        const zone = this.currentProject.zone;
        const region = this.currentProject.region;
        
        const zoneData = NEC_TABLES.ZONE_FACTORS[zone];
        const eta = NEC_TABLES.ETA_FACTORS[region];
        
        if (document.getElementById('z-value')) {
            document.getElementById('z-value').textContent = zoneData.Z;
            document.getElementById('risk-characterization').textContent = zoneData.risk;
            document.getElementById('eta-value').textContent = eta;
        }
    }
    
    updateLocalGeology() {
        const soilType = this.currentProject.soil;
        const soilProfile = NEC_TABLES.SOIL_PROFILES[soilType];
        
        if (document.getElementById('soil-description')) {
            document.getElementById('soil-description').textContent = soilProfile.description;
            document.getElementById('soil-definition').textContent = soilProfile.definition;
            
            // Actualizar factores según zona sísmica
            const zone = this.currentProject.zone;
            document.getElementById('fa-value').textContent = soilProfile.factors[zone].Fa;
            document.getElementById('fd-value').textContent = soilProfile.factors[zone].Fd;
            document.getElementById('fs-value').textContent = soilProfile.factors[zone].Fs;
        }
    }
    
    performCalculations() {
        // Cálculos usando la clase SeismicCalculator
        this.results = this.calculator.calculateAll(this.currentProject);
    }
    
    updateResults() {
        // Actualizar interfaz con resultados
        this.updateSummaryTable();
        if (this.results.spectrum) {
            this.updateSpectrum();
        }
    }
    
    loadDefaultValues() {
        // Cargar valores por defecto
        document.getElementById('project-name').value = 'Proyecto 1';
        document.getElementById('building-height').value = '11.31';
        document.getElementById('tx').value = '1';
        document.getElementById('ty').value = '1';
        document.getElementById('seismic-weight').value = '1';
    }
    
    // Métodos auxiliares para obtener valores seleccionados
    getSelectedImportance() {
        const selected = document.querySelector('input[name="importance"]:checked');
        return selected ? parseFloat(selected.value) : 1.0;
    }
    
    getSelectedPhiP() {
        const selected = document.querySelector('input[name="phi-p"]:checked');
        return selected ? parseFloat(selected.value) : 1.0;
    }
    
    // ... más métodos auxiliares ...
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.nec15App = new NEC15App();
});