function split(arr, arg) {
let newArr = [];
let index = 0;
let argindex;
if (arg === undefined ||arg == "") {
    for(let k = 0; k< arr.length; k++) {
        newArr.push(arr[k])
    }
    return newArr
}
if (arr === "<tastring>") {
    return
}
while ((argindex = arr.indexOf(arg, index)) !== -1) {
    newArr.push(arr.substring(index, argindex));
    index = argindex + arg.length;
}
newArr.push(arr.substring(index));


return newArr;
}

function join(arr, arg) {
    let newArr = '';
    for (let i = 0; i < arr.length; i++) {
        newArr += arr[i];

        if (i < arr.length - 1) {
            newArr += arg;
        }
    }
    return newArr;
}

// console.log(split('rrrr', 'rr'), ['', '', ''])
// console.log(join(['comment', 'va'], "-"))