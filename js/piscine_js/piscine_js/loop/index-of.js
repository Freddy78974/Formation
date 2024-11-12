function indexOf(arr = [], key, index) {
    let count = 0
    let res = []
    if ( index == undefined ) {
        index = 0
    } 
    arr.forEach(Element => {
        if (Element == key && count >= index) {
            res.push(count)
        }
        count++
    })
    if (res.length == 0) {
        return -1
    } else {
        return res[0]
    }
}
// console.log(indexOf([1, 6, 3, 4, 5, 6, 7, 8], 6))

function lastIndexOf(arr = [], key, index) {
    let count = 0
    let res = -1
    if ( index == undefined ) {
        index = arr.length
    } 
    arr.forEach(Element => {
        if (Element == key && count <= index) {
            res = count
        }
        count++
    })
   return res
}

console.log(lastIndexOf([1, 2, 3, 4, 5, 4, 3, 2, 1], 2))

function includes(arr = [], key) {
    let count = 0
    let res = []
    arr.forEach(Element => {
        if (Element == key) {
            res.push(count)
        } 
        count++
    }) 
    if (res.length > 0) {
        return true
    } else {
    return false
    }
}

// console.log(includes([1, 6, 3, 4, 5, 6, 7, 8], 2))