function pick(obj, str) {
     // Vérifie si str est une chaîne, si c'est le cas, le transforme en tableau contenant cette chaîne
     const arrStr = Array.isArray(str) ? str : [str];
    //  console.log(arrStr);
     // Utilise reduce pour construire un nouvel objet contenant uniquement les clés spécifiées
     const newObject = arrStr.reduce((acc, key) => {
         
         // Vérifie si la clé existe dans l'objet d'origine avant de l'ajouter au nouvel objet
         if (obj.hasOwnProperty(key)) {
             acc[key] = obj[key];
            }
            return acc;
        }, {});
        // Retourne le nouvel objet sans modifier l'objet d'origine
        return newObject;
    }
    
    function omit(obj, str) {
        const arrStr = Array.isArray(str) ? str : [str];
        // Utilise reduce pour construire un nouvel objet contenant uniquement les clés qui ne doivent pas être omises
        const newobj = Object.keys(obj).reduce((acc, key) => {
            // console.log(newobj);
            // Vérifie si la clé n'est pas dans le tableau des clés à omettre avant de l'ajouter au nouvel objet
            if (!arrStr.includes(key)) {
                acc[key] = obj[key];
            }
            return acc;
        }, {});
     // Retourne le nouvel objet sans modifier l'objet d'origine
     return newobj;
}

// const exempleObjet = { a: 1, b: 2, c: 3, d: 4 };
// const clésÀSélectionner = ['a', 'c'];

// const nouvelObjetPick = pick(exempleObjet, clésÀSélectionner);
// console.log("Objet après pick:", nouvelObjetPick); // Devrait afficher { a: 1, c: 3 }

// const clésÀOmettre = ['b', 'd'];

// const nouvelObjetOmit = omit(exempleObjet, clésÀOmettre);
// console.log("Objet après omit:", nouvelObjetOmit); 