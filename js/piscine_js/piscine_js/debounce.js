function debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
      const context = this;
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
  
// const debouncedFunction = debounce(() => {
//     console.log('Debounced function called');
// }, 500);
  
// debouncedFunction();
 
// Fonction opDebounce avec une option
function opDebounce(func, delay, options = { leading: false }) {
    // Variable pour stocker l'ID du délai d'attente
    let timeoutId;
    // Booléen pour suivre si l'appel leading a été effectué
    let leadingExecuted = false;
  
    // La fonction retournée, qui prend n'importe quel nombre d'arguments
    return async function (...args) {
      // Le contexte de la fonction appelante
      const context = this;
  
      // Fonction pour exécuter la logique
      const execute = async () => {
        // Réinitialise l'ID du délai d'attente
        timeoutId = null;
  
        // Si leading est faux, appelle la fonction
        if (!options.leading) {
          func.apply(context, args);
        }
      };
  
      // Efface le délai d'attente actuel
      clearTimeout(timeoutId);
  
      // Si leading est vrai et l'appel leading n'a pas été effectué, appelle la fonction immédiatement
      if (options.leading && !leadingExecuted) {
        func.apply(context, args);
        leadingExecuted = true; // Marque l'appel leading comme effectué
      }
  
      // Utilise une promesse pour attendre la résolution du délai d'attente
      await new Promise((resolve) => {
        // Utilise un "setTimout" pour définir un nouveau délai d'attente
        timeoutId = setTimeout(async () => {
          // Si leading est faux ou si leading est vrai et l'appel leading a été effectué,
          // appelle la fonction après le délai
          if (!options.leading || (options.leading && leadingExecuted)) {
            func.apply(context, args);
          }
          resolve();
        }, delay);
      });
    };
  }
  
  
  
  
  
//   const opDebouncedFunction = opDebounce(() => {
//     console.log('Debounced function called with leading option');
//   }, 5000, 'Debounced function');

//   opDebouncedFunction();
 