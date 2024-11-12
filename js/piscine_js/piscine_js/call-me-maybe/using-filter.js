function filterShortStateName(arr) {
    return arr.filter(el => el.length < 7)
}

//----------------------------------------------------------------

function filterStartVowel(arr) { // commence par une voyelle
    return arr.filter(el => {
        if (el[0].toLowerCase() == 'a'
            || el[0].toLowerCase() == 'e' || el[0].toLowerCase() == 'i' 
            || el[0].toLowerCase() == 'o' || el[0].toLowerCase() == 'u'){
            return el
        }
        return false
     })
}

// let filterStartVowel = (arr) => arr.filter(word => startVowel(word));
// function startVowel(word) {
//     if (word[0].toLowerCase() == 'a' || word[0].toLowerCase() == 'e' || word[0].toLowerCase() == 'i' || word[0].toLowerCase() == 'o' || word[0].toLowerCase() == 'u') {
//         return word
//     }
//     return false
// }

//----------------------------------------------------------------

let filter5Vowels = (arr) => arr.filter(word => fiveVowels(word));
function fiveVowels(word) {
    let nbVowels = 0;
    for (let i = 0; i < word.length; i++) {
        const element = word[i].toLowerCase();
        if (element == 'a' || element == 'e' || element == 'i' || element == 'o' || element == 'u') {
            nbVowels++
         }
    }
    if (nbVowels >= 5) {
        return word
    } else {
        return false
    }
}

//----------------------------------------------------------------

let filter1DistinctVowel = (arr) => arr.filter(word => DistinctVowel(word));
function DistinctVowel(word) {
    let boola = false;
    let boole = false;
    let booli = false;
    let boolo = false;
    let boolu = false;
    for (let i = 0; i < word.length; i++) {
        const element = word[i].toLowerCase();
        if (element == 'a') {
            boola = true;
        } else if (element == 'e') {
            boole = true;
        } else if (element == 'i') {
            booli = true;
        } else if (element == 'o') {
            boolo = true;
        }else if (element == 'u') {
            boolu = true;
        }
    }

    let nbBool = 0;
    if (boola == true) {
        nbBool++
    }
    if (boole == true) {
        nbBool++
    }
    if (booli == true) {
        nbBool++
    }
    if (boolo == true) {
        nbBool++
    }
    if (boolu == true) {
        nbBool++
    }
    if (nbBool == 1) {
        return word
    }
    return false
}

//----------------------------------------------------------------

let multiFilter = (arr) => arr.filter(obj => multiFil(obj));
function multiFil(obj) {
    // let ok = true;
    // console.log(obj)
    // console.log(obj.capital.length, obj.name[0].toLowerCase(), obj.tag, obj.region)
    if (obj.capital.length < 8) {
        console.log('MERDE 1')
        return false;
    }

    let firstLetter = obj.name[0].toLowerCase();
    if (firstLetter == 'a' || firstLetter == 'e' || firstLetter == 'i' || firstLetter == 'o' || firstLetter == 'u') {
        console.log('MERDE 2')
        return false;
    }

    let oneVowel = false;
    for (let i = 0; i < obj.tag.length; i++) {
        const element = obj.tag[i].toLowerCase();
        if (element === 'a' || element === 'e' || element === 'i' || element === 'o' || element === 'u') {
            oneVowel = true;
            break
        }
    }
    if (!oneVowel) {
        console.log('MERDE 3')
        return false
    }

    if (obj.region == 'South') {
        console.log('MERDE 4')
        return false;
    }

    return obj

}

// console.log(filter1DistinctVowel([
//     'Alabama',
//     'Alaska',
//     'Arizona',
//     'Arkansas',
//     'Idaho',
//     'Illinois',
//     'Indiana',
//     'Iowa',
//     'Ohio',
//     'Oklahoma',
//     'Oregon',
//     'MUtah',
//   ]))

// console.log(filter5Vowels(['bonjerioiur comment pgd vas-tu ta race']))