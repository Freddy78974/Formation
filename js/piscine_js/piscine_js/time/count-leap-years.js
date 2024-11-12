function countLeapYears(date) {
    let leap = 0
    for (let i = 1; i < date.getFullYear(); i++) {
        if ((i%4 == 0 && i%100!=0) || (i%400==0)) {
            leap++
        }
    }
    return leap;
}

// console.log(countLeapYears(new Date('0001-12-01')))