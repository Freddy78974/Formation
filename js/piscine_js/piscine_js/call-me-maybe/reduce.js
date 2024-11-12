function fold(arr, func, accumulator) {
    for (var i = 0; i < arr.length; i++) {
        accumulator = func(accumulator, arr[i], i, arr);
    }
    return accumulator;
}
// fold([1, 2, 3], adder, 2) // returns 8 (2 + 1 + 2 + 3)

function foldRight(arr, func, accumulator) {
    for (var i = arr.length-1; i >= 0; i--) {
        accumulator = func(accumulator, arr[i], i, arr);
    }
    return accumulator;
}
// foldRight([1, 2, 3], adder, 2) // returns 8 (2 + 3 + 2 + 1)

function reduce(arr, func, accumulator) {
    let demarrage = 0;
    if (typeof accumulator == 'undefined') {
        accumulator = arr[0];
        demarrage = 1;
    }

    for (var i = demarrage; i < arr.length; i++) {
        accumulator = func(accumulator, arr[i], i, arr);
    }
    return accumulator;
}
// reduce([1, 2, 3], adder) // returns 6 (1 + 2 + 3)

function reduceRight(arr, func, accumulator) {
    let demarrage = arr.length-1;
    if (typeof accumulator == 'undefined') {
        accumulator = arr[arr.length-1];
        demarrage = arr.length-2;
    }
    
    for (var i = demarrage; i >= 0; i--) {
        accumulator = func(accumulator, arr[i], i, arr);
    }
    return accumulator;
}
// reduceRight([1, 2, 3], adder) // returns 6 (3 + 2 + 1)