function isPositive(num) {
    if (num > 0) {
        return true;
    } else {
        return false;
    }
}

function abs(num) {
    if (isPositive(num)) {
        return num
    } else if (num === 0) {
        return 0
    } else {
        return num * -1;
    } 
}
