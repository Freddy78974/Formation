// Fonction retry
function retry(count, callback) {
    // Retourne une fonction asynchrone
    return async function(...args) {
      // Initialisation du compteur d'essais
      let retries = 0;
  
      // Boucle tant que le nombre d'essais est inférieur ou égal à count
      while (retries <= count) {
        try {
          // Appelle la fonction callback avec les arguments fournis
          return await callback(...args);
        } catch (error) {
          // En cas d'erreur, incrémente le compteur d'essais
          retries++;
  
          // Si le nombre d'essais atteint le maximum, lance une erreur
          if (retries > count) {
            throw new Error('Maximum number of retries reached');
          }
        }
      }
    };
  }
  
  // Fonction timeout
  function timeout(delay, callback) {
    // Retourne une fonction asynchrone
    return async function(...args) {
      // Crée une promesse qui se résout avec le résultat de la fonction callback
      const resultPromise = callback(...args);
  
      // Crée une promesse qui se résout après le délai spécifié
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), delay);
      });
  
      // Utilise Promise.race pour renvoyer la première promesse résolue
      try {
        return await Promise.race([resultPromise, timeoutPromise]);
      } catch (error) {
        // En cas d'erreur, lance une nouvelle erreur avec le message 'Timeout'
        throw new Error('Timeout');
      }
    };
  }
  

  
  const retryFunction = retry(3, async function() {
    // Simule une opération asynchrone qui pourrait échouer
    if (Math.random() < 0.8) {
      throw new Error('Erreur aléatoire');
    }
  
    // Simule le succès de l'opération
    return 'Opération réussie';
  });
  
  const timeoutFunction = timeout(2000, async function() {
    // Simule une opération asynchrone prenant du temps
    await new Promise(resolve => setTimeout(resolve, 3000));
  
    // Simule le succès de l'opération
    return 'Opération réussie';
  });
  
  // Appel de la fonction retry avec gestion d'erreur
  retryFunction()
    .then(result => console.log('Résultat de retryFunction:', result))
    .catch(error => console.error('Erreur de retryFunction:', error.message));
  
  // Appel de la fonction timeout avec gestion d'erreur
  timeoutFunction()
    .then(result => console.log('Résultat de timeoutFunction:', result))
    .catch(error => console.error('Erreur de timeoutFunction:', error.message));
  