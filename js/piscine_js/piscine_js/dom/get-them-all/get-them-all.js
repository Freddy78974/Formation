function getArchitects() {
    let a = document.getElementsByTagName('a')
    let arrDeA = [...a]
    let span = document.getElementsByTagName('span')
    let arrDeSpan = [...span]
    return [arrDeA, arrDeSpan]
}
 
function getClassical() {
    let classy = document.getElementsByClassName('classical')
    let arrClassy = [...classy]
    let nonClassyMod = document.getElementsByClassName('modern')
    let nonClassyBar = document.getElementsByClassName('baroque')
    let arrNonClassy = [...nonClassyMod, ...nonClassyBar]
    return [arrClassy, arrNonClassy]
}

// https://stackoverflow.com/questions/21975881/how-to-select-element-that-does-not-have-specific-class
function getActive() {
    let active = document.querySelectorAll('a.classical.active')
    let arrActive = [...active]
    let nonActive = document.querySelectorAll('a.classical:not(.active)')
    let arrNonActive = [...nonActive]
    return [arrActive, arrNonActive]
}
 
function getBonannoPisano() {
    let bonnanno = document.getElementById('BonannoPisano')
    let autre = document.querySelectorAll('a.classical.active')
    let arrAutre = [...autre]
    return [bonnanno, arrAutre]
}
 
export {
    getArchitects,
    getClassical,
    getActive,
    getBonannoPisano,
}