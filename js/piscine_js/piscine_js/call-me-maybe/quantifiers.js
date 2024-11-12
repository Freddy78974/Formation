function every(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        if (!func(arr[i])) {
            return false;
        }
    }
    return true;
}
 
function some(arr, func) {
    for (let i = 0; i < arr.length; i++) {
        if (func(arr[i])) {
            return true;
        }
    }
    return false;
}
 
function none(arr, func) {
    return !some(arr, func);
}
 