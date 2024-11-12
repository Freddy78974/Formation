function interpolation({step, start, end, callback, duration} = {}) {
    // Calcul du changement de valeur entre chaque étape.
    const delta = (end - start) / step;

    // Initialisation de la valeur courante.
    let current = start;
    // Initialisation de i 
    let i = 0;
    // Configuration de l'intervalle pour exécuter le code à chaque étape.
    const timer = setInterval(() => {
        if (i < step) {
            // Appel de la fonction de rappel avec le point d'interpolation actuel.
            callback([current, (duration/step) * (i+1)]);

            // Mise à jour de la valeur courante.
            current += delta;
            i++;
        }else { 
            // Toutes les étapes ont été parcourues, arrêt de l'intervalle.
            clearInterval(timer);
        }
    }, duration / step);
}

// const exampleCallback = ([x, y]) => {
//     console.log(`Callback appelé avec x : ${x.toFixed(2)}, y : ${y.toFixed(2)}`);
// };

// interpolation({
//     step: 5,
//     start: 0,
//     end: 1,
//     callback: exampleCallback,
//     duration: 10,
// });

