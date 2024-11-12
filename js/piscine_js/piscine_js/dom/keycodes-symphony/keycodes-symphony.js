// Définir la fonction de composition
function compose() {
    document.addEventListener("keydown", 
    function(event) {
    // Vérifiez si la touche enfoncée est une lettre de l'alphabet minuscule
    if (event.key.match(/^[a-z]$/)) {
      // Créer un nouvel élément div
      const note = document.createElement("div");
      
      // Définissez l'attribut de classe du div sur "note"
      note.className = "note";
      
      // Générez une couleur de fond unique en utilisant la clé de l'événement
      const backgroundColor = `hsl(${event.key.charCodeAt(0) * 10}, 70%, 50%)`;
      
      // Définir la couleur d'arrière-plan et le contenu du texte du div
      note.style.backgroundColor = backgroundColor;
      note.textContent = event.key;
          
      const bd = document.body
      bd.append(note)
    } else if (event.key == "Escape") {
        let effaceNote = document.getElementsByClassName("note")
        while(effaceNote.length > 0) {
            effaceNote[0].remove()
        }
        
    } else if (event.key == "Backspace") {
        let effaceNote = document.getElementsByClassName("note")
        effaceNote[effaceNote.length - 1].remove()
    } 
});
  }
  

export {
    compose,
}