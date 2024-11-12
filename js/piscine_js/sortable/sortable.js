// Function to get the corresponding sort key for a given header
const getSortKey = (header) => {
  switch (header) {
    case "Icon":
      return "image"; // You may need to adjust this based on your sorting implementation
    case "Name":
      return "name";
    case "Full Name":
      return "biography.fullName";
    case "intelligence":
      return "powerstats.intelligence";
    case "strength":
      return "powerstats.strength";
    case "speed":
      return "powerstats.speed";
    case "durability":
      return "powerstats.durability";
    case "power":
      return "powerstats.power";
    case "combat":
      return "powerstats.combat";
    case "Race":
      return "appearance.race";
    case "Gender":
      return "appearance.gender";
    case "Height":
      return "appearance.height";
    case "Weight":
      return "appearance.weight";
    case "Place Of Birth":
      return "biography.placeOfBirth";
    case "Alignment":
      return "biography.alignment";
    default:
      return "";
  }
};
// Modifiez la fonction loadData
const updatePageSize = () => {
  loadData();
};
let sortOrder = "asc";
let sortColumn = "name";
/**
 * Fonction qui gère le tri du tableau en fonction d'une colonne donnée.
 * Si la colonne est la même que celle déjà triée, elle inverse l'ordre de tri.
 * Sinon, elle initialise le tri en ordre ascendant pour la nouvelle colonne.
 * Enfin, elle appelle la fonction loadData pour mettre à jour l'affichage du tableau trié.
 *
 * @param {string} column - La colonne selon laquelle trier le tableau.
 */
const sortTable = (column) => {
  if (column === sortColumn) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
  } else {
    sortOrder = "asc";
    sortColumn = column;
  }
  loadData();
};
/**
 * Fonction qui effectue le tri des données en fonction d'une colonne et d'un ordre donnés.
 * Elle utilise une logique de tri numérique pour les colonnes numériques et alphabétique pour les autres.
 * Gère également les valeurs manquantes en les plaçant à la fin lors du tri.
 *
 * @param {Array} data - Les données à trier.
 * @param {string} column - La colonne selon laquelle trier les données.
 * @param {string} order - L'ordre de tri ("asc" pour croissant, "desc" pour décroissant).
 * @returns {Array} - Les données triées.
 */
const sortData = (data, column, order) => {
  return data.sort((a, b) => {
    const aValue = getValueByPath(a, column);
    const bValue = getValueByPath(b, column);
    // Handle missing values
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    // Numeric sorting for numerical columns
    if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }
    // String sorting for other columns
    return order === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
};
/**
 * Fonction qui récupère la valeur d'une propriété d'un objet en suivant un chemin spécifié.
 *
 * @param {Object} object - L'objet dont récupérer la valeur.
 * @param {string} path - Le chemin de la propriété dans l'objet (ex. "nested.property").
 * @returns {*} - La valeur de la propriété, ou undefined si le chemin n'est pas trouvé.
 */
const getValueByPath = (object, path) => {
  return path.split(".").reduce((acc, key) => acc && acc[key], object);
};
const loadData = async () => {
  const selectedValue = document.getElementById("NumberdisplayHeros").value;
  //Pour search
  const searchQuery = document.getElementById("search").value.toLowerCase();
  // Demander le fichier avec fetch, les données seront téléchargées dans le cache de votre navigateur.
  const response = await fetch(
    "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json"
  );
  const heroes = await response.json();
  // Sélectionner l'élément du DOM où vous souhaitez insérer la table
  const tableContainer = document.getElementById("table-container");
  // Créer une table
  const table = document.createElement("table");
  const headerRow = table.createTHead().insertRow(0);
  const headers = [
    "Icon",
    "Name",
    "Full Name",
    "intelligence",
    "strength",
    "speed",
    "durability",
    "power",
    "combat",
    "Race",
    "Gender",
    "Height(cm)",
    "Weight(kg)",
    "Place Of Birth",
    "Alignment",
  ];
  /**
   * Fonction qui crée les cellules d'en-tête du tableau en fonction des entêtes spécifiées.
   * Chaque cellule d'en-tête contient un texte d'en-tête, et est associée à une fonction de tri
   * lorsqu'elle est cliquée.
   *
   * @param {Array} headers - Un tableau contenant les textes d'en-tête des colonnes.
   */
  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    const onclickAttribute = `onclick="sortTable('${getSortKey(headerText)}')"`;
    th.innerHTML = `<span ${onclickAttribute}>${headerText}</span>`;
    headerRow.appendChild(th);
  });
  // Définir la valeur par défaut à 20 si aucune valeur n'est sélectionnée
  const displaySize =
    selectedValue === "all" ? heroes.length : parseInt(selectedValue, 10) || 20;
  let displayedCount = 0;
  const filteredHeroes = heroes
    .filter((hero) => hero.name.toLowerCase().includes(searchQuery))
    .slice(0, displaySize);
  /**
   * Applique le tri aux héros filtrés en fonction de la colonne de tri et de l'ordre spécifiés.
   *
   * @param {Array} filteredHeroes - Tableau des héros filtrés à trier.
   * @param {string} sortColumn - La colonne selon laquelle trier les héros.
   * @param {string} sortOrder - L'ordre de tri ("asc" pour croissant, "desc" pour décroissant).
   * @returns {Array} - Un nouveau tableau des héros triés.
   */
  const sortedHeroes = sortData(filteredHeroes, sortColumn, sortOrder);
  sortedHeroes.forEach((hero) => {
    //Changement de la boucle for, pour search sur tous les heros, pas seuleument ceux afficher
    // Apply les filtres de search
    if (!hero.name.toLowerCase().includes(searchQuery)) {
      return;
    }
    if (displayedCount < displaySize) {
      //Parcourir les heros pour afficher le nombre voulu
      const row = table.insertRow();
      // Ajouter l'image du super-héros
      const imageCell = row.insertCell(0);
      imageCell.classList.add("image-column"); // Ajout de la classe pour la largeur fixe
      const img = document.createElement("img");
      img.src = hero.images.xs;
      imageCell.appendChild(img);
      // Ajouter le nom du super-héros
      const nameCell = row.insertCell(1);
      nameCell.appendChild(document.createTextNode(hero.name));
      const fullnameCell = row.insertCell(2);
      fullnameCell.appendChild(
        document.createTextNode(hero.biography.fullName)
      );
      const PowerstatsintelligenceCell = row.insertCell(3);
      PowerstatsintelligenceCell.appendChild(
        document.createTextNode(hero.powerstats.intelligence)
      );
      const PowerstatsstrengthCell = row.insertCell(4);
      PowerstatsstrengthCell.appendChild(
        document.createTextNode(hero.powerstats.strength)
      );
      const PowerstatsspeedCell = row.insertCell(5);
      PowerstatsspeedCell.appendChild(
        document.createTextNode(hero.powerstats.speed)
      );
      const PowerstatsdurabilityCell = row.insertCell(6);
      PowerstatsdurabilityCell.appendChild(
        document.createTextNode(hero.powerstats.durability)
      );
      const PowerstatspowerCell = row.insertCell(7);
      PowerstatspowerCell.appendChild(
        document.createTextNode(hero.powerstats.power)
      );
      const PowerstatscombatCell = row.insertCell(8);
      PowerstatscombatCell.appendChild(
        document.createTextNode(hero.powerstats.combat)
      );
      const RaceCell = row.insertCell(9);
      RaceCell.appendChild(document.createTextNode(hero.appearance.race));
      const genderCell = row.insertCell(10);
      genderCell.appendChild(document.createTextNode(hero.appearance.gender));
      const height = row.insertCell(11);
      height.appendChild(
        document.createTextNode(
          getNumeric(parseInt(hero.appearance.height[1], 10))
        )
      );
      const weigthCell = row.insertCell(12);
      weigthCell.appendChild(
        document.createTextNode(
          getNumeric(parseInt(hero.appearance.weight[1], 10))
        )
      );
      const placeofbrirthCell = row.insertCell(13);
      placeofbrirthCell.appendChild(
        document.createTextNode(hero.biography.placeOfBirth)
      );
      const alignmentCell = row.insertCell(14);
      alignmentCell.appendChild(
        document.createTextNode(hero.biography.alignment)
      );
      displayedCount++; //Incrementation pour parcourir
    }
  });
  tableContainer.innerHTML = ""; // Effacer le contenu précédent
  tableContainer.appendChild(table);
};
const getNumeric = (height) => {
  const numericHeight = parseInt(height, 10);
  return isNaN(numericHeight) ? 0 : numericHeight;
};
// Initially load data with default sorting
loadData();
// Ajouter un écouteur d'événements pour le changement de taille de page
const pageSizeSelect = document.getElementById("NumberdisplayHeros");
pageSizeSelect.addEventListener("change", updatePageSize);
/*// Définir la valeur par défaut à 20 et déclencher manuellement l'événement de changement
pageSizeSelect.value = "20";
updatePageSize();*/
// Demandez le fichier avec fetch, les données seront téléchargées dans le cache de votre navigateur.
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => response.json()) // analyser la réponse de JSON
  .then(loadData); // .then appellera la fonction `loadData` avec la valeur JSON.
