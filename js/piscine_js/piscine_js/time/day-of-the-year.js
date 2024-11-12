function dayOfTheYear(date) {
    // Récupérer le jour de l'année
    // le nombre de millisecondes écoulées depuis le 1er janvier 1970 à 00:00:00 UTC jusqu'à la date spécifiée
    let tempsTotalMilisec = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    // le nombre de millisecondes écoulées depuis le 1er janvier de l'années en cour
    let tempsMilisecDepuisDebutAnnees = Date.UTC(date.getFullYear(), 0, 0);
    let dayOfYear = Math.floor((tempsTotalMilisec - tempsMilisecDepuisDebutAnnees) / (24 * 60 * 60 * 1000));

    return dayOfYear
}