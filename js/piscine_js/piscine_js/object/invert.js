function invert(obj = {}) { 
    let newobj = {}
    for (let key in obj) {
        if (Object.hasOwnProperty.call(obj,key)) {
            let value = obj[key]
            newobj[value] = key
        }
    }
    return newobj
}

// console.log(invert({ language: 'english' }), { english: 'language'})

// let obj = {
//     key: values
// }