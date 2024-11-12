const AnneeParPlanete = {
        earth: 1.0,
        mercury: 0.2408467,
        venus: 0.61519726,
        mars: 1.8808158,
        jupiter: 11.862615,
        saturn: 29.447498,
        uranus: 84.016846,
        neptune: 164.79132
    };
function dogYears(planet, ageEnSeconds) {
    const earthEnSeconds = 31_557_600;
    const AnneeDeChienSurTerre = 7; 
    const nom = planet
    const ageInEarthYears = ageEnSeconds / earthEnSeconds;

    const ageInDogYears = Math.round((ageInEarthYears * AnneeDeChienSurTerre / AnneeParPlanete[planet]) * 100)/100;

    return ageInDogYears;
}


