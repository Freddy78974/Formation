import { colors } from "./fifty-shades-of-cold.data.js"

function generateClasses() {
    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    colors.forEach((color) => {
        style.innerHTML += `.${color} {\n  background: ${color};\n }\n\n`;
    });
    console.log(style.innerHTML);
    head.appendChild(style);
    
}

function generateColdShades() {
    for (let i = 0; i < colors.length; i++) {
        if (
            colors[i].match(/(aqua|blue|turquoise|green|cyan|navy|purple)/) !== null
        ) {
        let styles = document.createElement('div')
        styles.className = colors[i]
        styles.textContent = colors[i]
        document.body.append(styles)
        }
    }
}

function choseShade(shade) {
    document.querySelectorAll("div").forEach((div) => {
        div.className = shade;
    });
}


export {
    generateClasses,
    generateColdShades,
    choseShade,
}