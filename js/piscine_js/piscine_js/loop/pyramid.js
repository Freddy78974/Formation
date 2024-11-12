function pyramid(str, num) {
    let arr = []
    let temp =''
    let esptemp = ''
    let count = 0
    for (let k = 0; k < str.length; k++) {
        esptemp += ' '
    }
    for (let i = 0; i < num*2; i++) {
        count++;
        if(i%2 == 0) { 
        for (let j = 0; j < count; j++) {
            temp += str
        }
        arr.push(temp)
        temp = ''
        } else {
        continue
        }
    }
    let count2 = 0
    for (let h = arr.length-1; h >= 0; h--) { // ici
        if (h != arr.length-1) {
            for (let y = 0; y <= count2; y++) {
                arr[h] = esptemp+arr[h] 
            }
            count2++
        }
    }
return arr.join(('\n'))
}

// console.log(pyramid('HGUHGHJOKBUHO', 5))