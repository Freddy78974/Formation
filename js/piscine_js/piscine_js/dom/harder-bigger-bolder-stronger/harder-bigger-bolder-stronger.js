function generateLetters() {
    let letter_num = 0; // incrementation jusqu'a 120
    let newDiv
        for (let i = 0; i < 120; i++) {
            newDiv = document.createElement('div')
            newDiv.textContent = randomLetter()
            newDiv.style.fontSize = `${11 + letter_num}px`;
            newDiv.id = 
            letter_num++
            if (letter_num <= 40) {
                newDiv.style.fontWeight = "300";
            } else if (letter_num <= 80) {
                newDiv.style.fontWeight = "400";
            } else {
                newDiv.style.fontWeight = "600";
            }
            document.body.append(newDiv)
        }
}


function randomLetter(){
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let index_letter = Math.floor(Math.random() * alphabet.length);
    return alphabet[index_letter];
}

export {
    generateLetters,
}