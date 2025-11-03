export const DESIGN_RECOMMENDATIONS = {
    // Recomendaciones por Zona Sísmica
    getZoneRecommendation(zone) {
        const recommendations = {
            'I': {
                title: 'Zona I - Sismicidad Intermedia',
                strategy: 'Enfoque en economía. Se permiten sistemas de ductilidad limitada en estructuras bajas.',
                priority: 'low'
            },
            'II': {
                title: 'Zona II - Sismicidad Alta', 
                strategy: 'Priorizar ductilidad y regularidad. Sistemas estructurales dúctiles (R alto).',
                priority: 'medium'
            },
            // ... completar todas las zonas
            'VI': {
                title: 'Zona VI - Sismicidad Muy Alta',
                strategy: 'Máxima ductilidad y redundancia. Sistemas duales preferentemente. Análisis dinámico no lineal recomendado.',
                priority: 'high'
            }
        };
        return recommendations[zone] || recommendations['V'];
    },
    
    // Recomendaciones por combinación Zona + Suelo
    getCombinationRecommendation(zone, soil) {
        const combinations = {
            'Alta_D': {
                condition: 'Zona Alta (III-V) + Suelo D',
                risk: 'Amplificación moderada-alta',
                recommendation: 'Usar R ≥ 7. Preferir pórticos especiales o sistemas duales. Control estricto de derivas.'
            },
            'MuyAlta_C': {
                condition: 'Zona Muy Alta (VI) + Suelo C',
                risk: 'Aceleraciones espectrales muy altas', 
                recommendation: 'Sistema Dual (R=8). Evitar irregularidades torsionales. Muros bien distribuidos en planta.'
            },
            // ... más combinaciones
        };
        
        const key = this.getCombinationKey(zone, soil);
        return combinations[key];
    },
    
    // Generar recomendaciones completas
    generateAllRecommendations(projectData) {
        const recommendations = [];
        
        // Recomendación por zona
        const zoneRec = this.getZoneRecommendation(projectData.zone);
        recommendations.push({
            type: 'zone',
            title: zoneRec.title,
            content: zoneRec.strategy,
            priority: zoneRec.priority
        });
        
        // Recomendación por combinación
        const combRec = this.getCombinationRecommendation(projectData.zone, projectData.soil);
        if (combRec) {
            recommendations.push({
                type: 'combination',
                title: `Combinación: ${combRec.condition}`,
                content: `${combRec.risk}. ${combRec.recommendation}`,
                priority: 'high'
            });
        }
        
        // Recomendaciones estructurales
        if (projectData.phip === '0.9' || projectData.phie === '0.9') {
            recommendations.push({
                type: 'structural',
                title: 'Configuración Estructural Irregular',
                content: 'Considerar revisar el diseño para mejorar la regularidad. Las irregularidades aumentan las fuerzas sísmicas.',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
};