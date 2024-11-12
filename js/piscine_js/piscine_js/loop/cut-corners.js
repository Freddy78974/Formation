function round(num) {
    let ChiffreApresVirgule = modulo(num*10, 10);
        console.log(ChiffreApresVirgule);
    let ChiffreAvantVirgule = num - (ChiffreApresVirgule/10);
        console.log(ChiffreAvantVirgule);
    if (ChiffreApresVirgule >= 5 ) {
        return ChiffreAvantVirgule + 1
    } else if (ChiffreApresVirgule <= -5) {
        return ChiffreAvantVirgule -1
    } else {
        return ChiffreAvantVirgule
    }
}

function ceil(num) {
    let ChiffreApresVirgule = modulo(num*10, 10);
        // console.log(ChiffreApresVirgule);
    let ChiffreAvantVirgule = num - (ChiffreApresVirgule/10);
        // console.log(ChiffreAvantVirgule);
    if (ChiffreApresVirgule > 0) {
        return ChiffreAvantVirgule + 1
    } else if (ChiffreApresVirgule < 0) {
        return ChiffreAvantVirgule
    } else {
        return ChiffreAvantVirgule
    }
}

function floor(num) {
    let ChiffreApresVirgule = modulo(num*10, 10);
        // console.log(ChiffreApresVirgule);
    let ChiffreAvantVirgule = num - (ChiffreApresVirgule/10);
        // console.log(ChiffreAvantVirgule);
    if (ChiffreApresVirgule < 0) {
        return ChiffreAvantVirgule -1
    } else {
        return ChiffreAvantVirgule
    }
}

function nearest(n) {
    let pow = 0;
    if (n < 1 && n >= 0) return 0
    if (n < 0 && n >= -1) return 0
    for (let i = n; i > 1; i = i / 2) {
        pow += 1;
    }
    return pow-1 // retourne le nombre de bits
}
function trunc(n) {
    let x = 2 ** nearest(n);
    if (n >= 0) {
        for (;x < n; x++) {
            if (x===n) {
                return x
            }
        }
        return x - 1
    }    
    if (n < 0) {
        x=0
        for (;x > n; x--) {
            if (n > -1) {
                return 0
            }
        }
        if (x===n) {
            return x
        } 
        return x + 1
    }    
}

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

const numero = [3.7, -3.7, 3.1, -3.1]
console.log(numero.map(trunc))

