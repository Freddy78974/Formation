function longWords(arr) {
    return arr.every(el => el.length >= 5)
}

function oneLongWord(arr) {
    return arr.some(el => el.length >= 10)
}

function noLongWords(arr) {
    return arr.every(el => el.length < 7)
}
