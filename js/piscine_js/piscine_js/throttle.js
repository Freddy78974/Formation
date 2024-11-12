function throttle(func, delay) {
    // Stocke le dernier moment où la fonction a été appelée
    let lastCalled = 0;
  
    // Retourne une fonction qui encapsule la fonction d'origine
    return function (...args) {
      // Obtient le temps actuel
      const now = Date.now();
  
      // Vérifie si le délai entre les appels a été respecté
      if (now - lastCalled >= delay) {
        // Appelle la fonction d'origine avec les arguments fournis
        func.apply(this, args);
        // Met à jour le dernier moment où la fonction a été appelée
        lastCalled = now;
      }
    };
}

function opThrottle(func, wait, { leading = false, trailing = true } = {}) {
    // Le moment de la dernière exécution de la fonction
    let lastExecTime = 0;
    // L'identifiant du timeout utilisé pour le mode trailing
    let timeoutId = null;

    // Retourne une fonction qui encapsule la fonction d'origine
    return function () {
        // Obtient le temps actuel
        const currentTime = +new Date();

        // Si leading est désactivé et c'est la première exécution, met à jour lastExecTime avec l'horodatage actuel
        if (!lastExecTime && leading === false) {
            lastExecTime = currentTime;
        }

        // Si le temps écoulé depuis la dernière exécution est supérieur au délai spécifié
        if (currentTime - lastExecTime > wait) {
            // S'il y a un timeout en attente, l'annule
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            // Exécute la fonction
            func.apply(this, arguments);
            // Met à jour lastExecTime avec l'horodatage actuel
            lastExecTime = currentTime;
        } else if (!timeoutId && trailing !== false) {
            // Si trailing est activé et il n'y a pas de timeout en attente
            // Planifie l'exécution de la fonction après le délai spécifié
            timeoutId = setTimeout(() => {
                func.apply(this, arguments);
                // Met à jour lastExecTime avec l'horodatage actuel
                lastExecTime = +new Date();
                timeoutId = null;
            }, wait);
        }
    };
}

  
