class SeismicCalculator {
    calculateAll(projectData) {
        const siteFactors = this.calculateSiteFactors(projectData);
        const limitPeriods = this.calculateLimitPeriods(siteFactors);
        const fundamentalPeriod = this.calculateFundamentalPeriod(projectData);
        const spectralAcceleration = this.calculateSpectralAcceleration(siteFactors, limitPeriods, fundamentalPeriod);
        const reductionFactor = this.calculateReductionFactor(projectData);
        const baseShear = this.calculateBaseShear(spectralAcceleration, projectData, reductionFactor);
        const spectrum = this.generateDesignSpectrum(siteFactors, limitPeriods, reductionFactor.f);
        
        return {
            siteFactors,
            limitPeriods,
            fundamentalPeriod,
            spectralAcceleration,
            reductionFactor,
            baseShear,
            spectrum
        };
    }
    
    calculateSiteFactors(projectData) {
        const zoneData = NEC_TABLES.ZONE_FACTORS[projectData.zone];
        const eta = NEC_TABLES.ETA_FACTORS[projectData.region];
        const soilProfile = NEC_TABLES.SOIL_PROFILES[projectData.soil];
        
        return {
            Z: zoneData.Z,
            η: eta,
            Fa: soilProfile.factors[projectData.zone].Fa,
            Fd: soilProfile.factors[projectData.zone].Fd,
            Fs: soilProfile.factors[projectData.zone].Fs,
            r: projectData.soil === 'E' ? 1.5 : 1.0
        };
    }
    
    calculateLimitPeriods(siteFactors) {
        const { Fa, Fd, Fs } = siteFactors;
        
        return {
            To: 0.1 * (Fd * Fs / Fa),
            Tc: 0.55 * (Fd * Fs / Fa),
            Tl: 2.4 * Fd
        };
    }
    
    calculateFundamentalPeriod(projectData) {
        const coefficients = NEC_TABLES.STRUCTURAL_COEFFICIENTS[projectData.structuralType];
        return coefficients.Ct * Math.pow(projectData.height, coefficients.alpha);
    }
    
    calculateSpectralAcceleration(siteFactors, limitPeriods, T) {
        const { Z, Fa, η, r, To, Tc, Tl } = siteFactors;
        
        if (T < To) {
            return Z * Fa * (1 + (η - 1) * (T / To));
        } else if (T <= Tc) {
            return Z * η * Fa;
        } else if (T <= Tl) {
            return Z * η * Fa * Math.pow(Tc / T, r);
        } else {
            return Z * η * Fa * Math.pow(Tc / Tl, r) * (Tl / T);
        }
    }
    
    calculateReductionFactor(projectData) {
        const f = 1 / (projectData.reduction * projectData.phiP * projectData.phiE);
        return { f };
    }
    
    calculateBaseShear(Sa, projectData, reductionFactor) {
        const Cv = (projectData.importance * Sa) / (projectData.reduction * projectData.phiP * projectData.phiE);
        return {
            Cv: Cv,
            V: Cv * projectData.weight
        };
    }
    
    generateDesignSpectrum(siteFactors, limitPeriods, f) {
        const { Z, Fa, η, r, To, Tc, Tl } = siteFactors;
        const spectrum = [];
        
        // Puntos clave del espectro
        const keyPoints = [0, To, Tc, Tl];
        
        // Generar puntos para cada segmento del espectro
        for (let T of keyPoints) {
            const Sa = this.calculateSpectralAcceleration(siteFactors, limitPeriods, T);
            spectrum.push({
                period: T,
                elastic: Sa,
                reduced: Sa * f
            });
        }
        
        // Puntos intermedios para mejor resolución
        for (let T = 0; T <= 4; T += 0.1) {
            if (!keyPoints.includes(T)) {
                const Sa = this.calculateSpectralAcceleration(siteFactors, limitPeriods, T);
                spectrum.push({
                    period: T,
                    elastic: Sa,
                    reduced: Sa * f
                });
            }
        }
        
        // Ordenar por periodo
        return spectrum.sort((a, b) => a.period - b.period);
    }
}