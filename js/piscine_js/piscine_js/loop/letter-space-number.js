function letterSpaceNumber(str) {
    let arr = [];
    const regex = /[^\d\^0-9]/g;

    arr = str.match(regex);
    return arr
}

console.log(letterSpaceNumber('example 1, example 20'))
// output: ['e 1']