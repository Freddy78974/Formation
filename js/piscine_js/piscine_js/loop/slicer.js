function slice(str, start, option) {
let tab = [];
if (option === undefined) {
    option = str.length
}
if (start < 0) {
    start = str.length + start // taille du tableau + (-start) 
}
if (option < 0) {
    option = str.length + option
}
for (let i = 0; i < str.length; i++) {
    if (i >= start && i < option) {
    tab.push(str[i])
    }
} 

if (typeof str === "string") {
        return tab.join('')
    } else if (Array.isArray(str)) {
        return tab
    }
}
