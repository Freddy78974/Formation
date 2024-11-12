function filter(arr, func) {
    let array = [];
    for (let i = 0; i < arr.length; i++) {
        if (func(arr[i], i , arr)) {
            array.push(arr[i])
        }
    }
    return array
}

function reject(arr, func) {
    let array = [];
    for (let i = 0; i < arr.length; i++) {
        if (!func(arr[i], i , arr)) {
            array.push(arr[i])
        }
    }
    return array
}

function partition(arr, func) {
    return [filter(arr, func) , reject(arr, func)]    
}