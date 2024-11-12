
let isMouve = false

function createCircle() {
    document.body.addEventListener("mousedown", (e) => {
        let x = e.clientX;
        let y = e.clientY;
        let div = document.createElement("div");
        div.className = 'circle';
        div.id = 'circle'
        div.style.background = 'white';
        div.style.top = y-25 + 'px'; 
        div.style.left = x-25 + 'px'; 
        isMouve = true;
        document.body.appendChild(div);

    })
    
}

function moveCircle() {
    let cercle = document.getElementById('cercle');
    if (isMouve) {
        window.addEventListener('mousemove', cercle)

    }
}



function setBox() {

}

export {
    createCircle,
    moveCircle,
    setBox,
}