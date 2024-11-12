function triangle(str, num) {
    let arr = []
    let temp = ""
    let count = 0
    for (let i = 0; i < num; i++) {
        count++;
        for (let j = 0; j < count; j++) {
            temp += str
             }
             arr.push(temp)
             temp = ''
        }
    return arr.join(('\n'))
}

// console.log(triangle('*', 8))