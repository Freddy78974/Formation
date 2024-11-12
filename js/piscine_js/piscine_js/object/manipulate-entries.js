// Fonction pour filtrer les entrées en utilisant à la fois la clé et la valeur
// function filterEntries(cart, filter) {
//     return Object.fromEntries(Object.entries(cart).filter(entry => filter[0](entry[0], entry[1])));
//   }
function filterEntries(cart, filter) {
    const filterFunction = typeof filter[0] === 'function' ? filter[0] : (key, value) => true;
    return Object.fromEntries(Object.entries(cart).filter(entry => filterFunction(entry[0], entry[1])));
}
  
// Fonction pour mapper les entrées, changer la clé, la valeur ou les deux
function mapEntries(cart, mapper) {
    return Object.fromEntries(
      Object.entries(cart).map(([key, value]) => [key, mapper(key, value)])
    );
  }
  
// Fonction pour réduire les entrées passant des clés et des valeurs sous forme de tableau
function reduceEntries(cart, reducer, initialValue) {
    return Object.entries(cart).reduce((acc, entry) => reducer(acc, entry[0], entry[1]), initialValue);
}
  
// Fonctions supplémentaires utilisant celles ci-dessus
// Fonction pour calculer les calories totales d'un chariot
function totalCalories(cart) {
    const total = reduceEntries(cart, (acc, key, value) => acc + (nutritionDB[key].calories * value), 0);
    return parseFloat(total.toFixed(3)/100);
}
  
// Fonction pour filtrer les articles contenant moins de 50g de glucides
function lowCarbs(cart) {
    return filterEntries(cart, [(key, value) => nutritionDB[key].carbs * (value / 100) < 50, (value) => true]);
}
  
// Fonction permettant de calculer la valeur nutritionnelle totale de chaque article
function cartTotal(cart) {
    return mapEntries(cart, (key, value) => {
      const weight = value / 100; // Convertir des grammes en unités de 100 grammes
      return {
        calories: nutritionDB[key].calories * weight,
        protein: nutritionDB[key].protein * weight,
        carbs: nutritionDB[key].carbs * weight,
        sugar: nutritionDB[key].sugar * weight,
        fiber: nutritionDB[key].fiber * weight,
        fat: nutritionDB[key].fat * weight,
      };
    });
}
  
        
// // small database with nutrition facts, per 100 grams
// // prettier-ignore
// const nutritionDB = {
//     tomato:  { calories: 18,  protein: 0.9,   carbs: 3.9,   sugar: 2.6, fiber: 1.2, fat: 0.2   },
//     vinegar: { calories: 20,  protein: 0.04,  carbs: 0.6,   sugar: 0.4, fiber: 0,   fat: 0     },
//     oil:     { calories: 48,  protein: 0,     carbs: 0,     sugar: 123, fiber: 0,   fat: 151   },
//     onion:   { calories: 0,   protein: 1,     carbs: 9,     sugar: 0,   fiber: 0,   fat: 0     },
//     garlic:  { calories: 149, protein: 6.4,   carbs: 33,    sugar: 1,   fiber: 2.1, fat: 0.5   },
//     paprika: { calories: 282, protein: 14.14, carbs: 53.99, sugar: 1,   fiber: 0,   fat: 12.89 },
//     sugar:   { calories: 387, protein: 0,     carbs: 100,   sugar: 100, fiber: 0,   fat: 0     },
//     orange:  { calories: 49,  protein: 0.9,   carbs: 13,    sugar: 9,   fiber: 0.2, fat: 0.1   },
       
// }



// const groceriesCart = { orange: 500, oil: 20, sugar: 480 }

// console.log('Total calories:')
// console.log(totalCalories(groceriesCart))
// console.log('Items with low carbs:')
// console.log(lowCarbs(groceriesCart))
// console.log('Total cart nutritional facts:')
// console.log(cartTotal(groceriesCart))

// // Total calories:
// // 2112.2
// // Items with low carbs:
// // { oil: 20 }
// // Total cart nutritional facts:
// // {
// //   orange: {
// //     calories: 245,
// //     protein: 4.5,
// //     carbs: 65,
// //     sugar: 45,
// //     fiber: 1,
// //     fat: 0.5
// //   },
// //   oil: {
// //     calories: 9.6,
// //     protein: 0,
// //     carbs: 0,
// //     sugar: 24.6,
// //     fiber: 0,
// //     fat: 30.2
// //   },
// //   sugar: {
// //     calories: 1857.6,
// //     protein: 0,
// //     carbs: 480,
// //     sugar: 480,
// //     fiber: 0,
// //     fat: 0
// //   }
// // }
