function build(num) {
    let count = 0
    let i = 1
    let newDiv
        let interval = setInterval(() => {
        newDiv = document.createElement('div')
        newDiv.id = 'brick-' + i
        newDiv.textContent = i;
        count++
            if (count%3 === 2) {
                // newDiv.setAttribute("foundation", true)
                newDiv.dataset.foundation = true
            }
            document.body.append(newDiv)
            i++;
            if (i > num) {
                clearInterval(interval);
            }
        }, 100);
}


function repair(...ids) {
    ids.forEach(id => {
        let i = document.getElementById(id)
        if (i.hasAttribute("foundation")) {
            // i.textContent += "-in progress";
            i.dataset.repaired = "-in progress"
        } else {
            // i.textContent += "-repaired";
            i.dataset.repaired = true
        }
    });
}

function destroy() {
    let bricks = document.getElementsByTagName("div");
   
    bricks[bricks.length - 1].remove();
  
    
}

export {
    build,
    repair,
    destroy,
}