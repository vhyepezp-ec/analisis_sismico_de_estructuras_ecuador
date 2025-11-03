// Datos completos de la NEC-15
const NEC_TABLES = {
    ZONE_FACTORS: {
        'I': { Z: 0.15, risk: 'Intermedia' },
        'II': { Z: 0.25, risk: 'Alta' },
        'III': { Z: 0.3, risk: 'Alta' },
        'IV': { Z: 0.35, risk: 'Alta' },
        'V': { Z: 0.4, risk: 'Alta' },
        'VI': { Z: 0.5, risk: 'Muy Alta' }
    },
    
    ETA_FACTORS: {
        'sierra': 2.48, 
        'costa': 1.8, 
        'oriente': 2.6
    },
    
    SOIL_PROFILES: {
        'A': {
            description: 'Perfil de roca competente',
            definition: 'Vs ≥ 1500 m/s',
            factors: { Fa: 0.9, Fd: 0.9, Fs: 0.75 }
        },
        // ... completar todos los tipos de suelo
    },
    
    // Tablas completas de factores Fa, Fd, Fs
    FA_TABLE: {
        'I': {'A': 0.9, 'B': 1.0, 'C': 1.4, 'D': 1.6, 'E': 1.8, 'F': 1.0},
        'II': {'A': 0.9, 'B': 1.0, 'C': 1.3, 'D': 1.4, 'E': 1.4, 'F': 1.0},
        // ... completar todas las zonas
    },
    
    // Factores de reducción completos
    REDUCTION_FACTORS: {
        'ductile': {
            '8': [
                'Pórticos especiales sismo resistentes, de hormigón armado con vigas descolgadas y con muros estructurales',
                'Pórticos especiales sismo resistentes de acero laminado en caliente con diagonales rigidizadoras',
                // ... todas las opciones
            ],
            '7': [
                'Pórticos especiales sismo resistentes, de hormigón armado con vigas banda, con muros estructurales',
            ],
            '5': [
                'Sistemas de muros estructurales dúctiles de hormigón armado',
                'Pórticos especiales sismo resistentes de hormigón armado con vigas banda'
            ]
        },
        'limited': {
            '3': [
                'Hormigón Armado con secciones de dimensión menor a la especificada en la NEC-SE-HM',
                'Mampostería reforzada, limitada a 2 pisos',
                // ... todas las opciones
            ],
            '2.5': [
                'Estructuras de acero conformado en frío, aluminio, madera, limitados a 2 pisos'
            ],
            '1': [
                'Mampostería no reforzada, limitada a un piso'
            ]
        }
    }
};

// Funciones para acceder a las tablas
export function getZoneFactor(zone) {
    return NEC_TABLES.ZONE_FACTORS[zone]?.Z || 0.4;
}

export function getRiskCharacterization(zone) {
    return NEC_TABLES.ZONE_FACTORS[zone]?.risk || 'Alta';
}

// ... más funciones exportadas