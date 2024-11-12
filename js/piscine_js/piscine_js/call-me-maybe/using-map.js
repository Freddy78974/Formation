function citiesOnly(arr) {
    let city = arr.map(el => el['city'])
    return city
}

//----------------------------------------------------------------

function upperCasingStates(arr) {
    let states = arr.map(el => capitalize(el))
    return states
}

function capitalize(str) {
    let res = str.split(' ');
    for (let i = 0; i < res.length; i++) {
        res[i] = res[i].charAt(0).toUpperCase() + res[i].slice(1);
    }
    return res.join(' ');
}

//----------------------------------------------------------------

function fahrenheitToCelsius(arr) {
    // (Fahrenheit - 32) * 5/9
    let celsius = arr.map(el => toCelsius(el))
    return celsius
}

function toCelsius(str) {
    let res = str.split(' ');
  
    let num = res[0].split('°F');
    let numero = Number(num[0])
    let result = Math.floor((numero - 32) * 5/9)
    // console.log("ok", result + '°C')

    return result + '°C'
}

//----------------------------------------------------------------

function trimTemp(arr) {
    let arra = arr.map(el => splitSpace(el))
    // console.log(arra)
    return arra
}

function splitSpace(obj) {
    let newObj = obj
    newObj.temperature = obj.temperature.replaceAll(' ', '')
    // console.log(newObj)
    return newObj
}

//----------------------------------------------------------------

function tempForecasts(arr) {
    let newArr = arr.map(el => toCelsius(el.temperature) + 'elsius in ' + capitalize(el.city) + ', ' + capitalize(el.state))
    return newArr
}

//----------------------------------------------------------------

// console.log(tempForecasts([
//     {
//       city: 'Pasadena',
//       temperature: ' 101 °F',
//       state: 'california',
//       region: 'West',
//     },
//   ])) // -> ['38°Celsius in Pasadena, California'])

// console.log(trimTemp([
//     { city: 'Los Angeles', temperature: '  101 °F   ' },
//     { city: 'San Francisco', temperature: ' 84 ° F   ' },
//   ]) /* -> [
//     { city: 'Los Angeles', temperature: '101°F' },
//     { city: 'San Francisco', temperature: '84°F' },
//   ] */) // -> ['20°C', '15°C', '-4°C']

// console.log(fahrenheitToCelsius(['68°F', '59°F', '25°F'])) // -> ['20°C', '15°C', '-4°C']


// console.log(upperCasingStates(['alabama', 'new jersey']))// -> ['Alabama', 'New Jersey']