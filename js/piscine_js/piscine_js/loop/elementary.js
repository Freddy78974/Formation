function multiply(a, b) {
    let res = 0
     if (b > 0) {
        for (let i = 0; i < b ; i++) {
            res += a
        }
    } else if (b < 0) {
        for (let index = 0; index > b; index--) {
            res -= a;
        }
    } else {
        return 0
    }
    return res
}

// combien de fois b va dans a
function divide(a, b) {
    let res = 0
    let negatif = false;
    if (a < 0 && b < 0) {
        a = multiply(a,-1);
        b = multiply(b,-1);
    } else if (a < 0) {
        negatif = true;
        a = multiply(a,-1);
    } else if (b < 0) {
        negatif = true;
        b = multiply(b,-1);
    } 
    if (b === 0 || b === 0) {
        return 0
    }
    for (let i = 0; i < a ; i++) {
        if (multiply(b, i) == a){
            res = i 
            break
         } else if (multiply(b,i) > a) {
            res = i-1
            break
         }
    }
    if (negatif == true) {
        return -res
    } else {
        return res
    }
}

function modulo(a, b) {
    let res = 0
    let negatif = false;
    if (a < 0 && b < 0) {
        negatif = true;
        a = multiply(a,-1);
        b = multiply(b,-1);
    } else if (a < 0) {
        negatif = true;
        a = multiply(a,-1);
    } else if (b < 0) {
        b = multiply(b,-1);
    } 
    if (b === 0 || b === 0) {
        return 0
    }
    for (let multipl = 1; multipl < a; multipl++) {
        if (multiply(multipl, b) > a) {
            res = multiply(multipl-1, b)
            break
        } 
    } 
    let result = a - res 
    if (negatif == true) {
        return -result
    } else {
        return result
    }
}
