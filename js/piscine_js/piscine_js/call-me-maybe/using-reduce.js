function adder (arr, num) {
    if (typeof num === "undefined") {
        num = 0;
    }
    let res = arr.reduce(function(accumulator, currentValue) {
        return accumulator + currentValue;
    },num);
    return res;
}
// console.log(adder([1, 2, 3, 4])); // 10
// console.log(adder([9, 24, 7, 11, 3], 10)) // 64

function sumOrMul (arr, num) {
    if (typeof num === "undefined") {
        num = 0;
    }
    let res = arr.reduce(function(accumulator, currentValue) {
        if (currentValue%2 == 0) { // chiffre pair
            return accumulator * currentValue;
        } else { // chiffre impair
            return accumulator + currentValue;
        }
    },num);
    return res
}
// console.log(sumOrMul([1, 2, 3, 5, 8], 5));

function funcExec (arr, num) {
    // console.log(arr)
    if (typeof num === "undefined") {
        num = 0;
    }
    let res = arr.reduce(function(accumulator, currentFunc) {
        return currentFunc(accumulator);
    }, num)
    return res
}