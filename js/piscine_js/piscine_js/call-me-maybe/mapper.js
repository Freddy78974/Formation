function map(arr, func) {
    let array = [];
    for (let i = 0; i < arr.length; i++) {
       array.push(func(arr[i], i, arr));
    }
    return array;
}
 
function flatMap(arr, func) {
    return arr.reduce((accumulator, currentvalue, index, arr) => accumulator.concat(func(currentvalue, index, arr)),[]);
}
 