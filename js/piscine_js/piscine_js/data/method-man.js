function words(str) {
    return str.split(' ')
}
function sentence(str) {
    return str.join(' ')
}
function yell(str) {
    return str.toUpperCase()
}
function whisper(str) {
    return '*' + str.toLowerCase(str) + '*'
}
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase()
}