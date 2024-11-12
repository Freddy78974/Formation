function nasa(N) {
    let tab = []
    for (let i = 1; i <= N;i++) {
        if (i%3 === 0 && i % 5 !== 0) {
            tab.push("NA");
        } else if (i%5 === 0 && i %3 !== 0) {
            tab.push("SA");
        } else if (i%5 === 0 && i%3 === 0) {
            tab.push("NASA");
        } else {
            tab.push(i);
        }
    }
    
    return tab.join(" ");
}

// console.log(nasa(15))