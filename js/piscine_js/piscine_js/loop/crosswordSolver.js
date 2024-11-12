function crosswordSolver(puzzle, words) {
  const rows = puzzle.split('\n').map(row => row.split(''));
  const wordList = words.slice(); // Copiez le tableau pour éviter de modifier l'original

  // Fonction d'assistance pour vérifier si un mot correspond à une position spécifique
  function canPlaceWord(word, row, col, direction) {
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        if (rows[row][col + i] !== '.' && rows[row][col + i] !== word[i]) {
          return false;
        }
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        if (rows[row + i][col] !== '.' && rows[row + i][col] !== word[i]) {
          return false;
        }
      }
    }
    return true;
  }

  // Fonction d'assistance pour placer un mot à une position spécifique
  function placeWord(word, row, col, direction) {
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        rows[row][col + i] = word[i];
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        rows[row + i][col] = word[i];
      }
    }
  }

  // Boucle principale pour remplir le puzzle
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[row].length; col++) {
      if (rows[row][col] !== '.' && !isNaN(rows[row][col])) {
        const direction = rows[row][col] === '0' ? 'horizontal' : 'vertical';
        const wordLength = parseInt(rows[row][col]);
        let possibleWords = wordList.filter(word => word.length === wordLength);

        for (const word of possibleWords) {
          if (canPlaceWord(word, row, col, direction)) {
            placeWord(word, row, col, direction);
            wordList.splice(wordList.indexOf(word), 1); // Supprimer le mot utilisé
            break;
          }
        }

        // Si aucun mot approprié n'est trouvé, imprimez « Erreur »
        if (wordList.length === 0 && possibleWords.length === 0) {
          console.log('Error');
          return;
        }
      }
    }
  }

  // Imprimez le puzzle rempli
  console.log(rows.map(row => row.join('')).join('\n'));
}

const emptyPuzzle = "5..2.\n.....\n3..1.\n.....\n.4..5";
const wordList = ["apple", "banana", "grape", "melon", "peach"];
crosswordSolver(emptyPuzzle, wordList);
