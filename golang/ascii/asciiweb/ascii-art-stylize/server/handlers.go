package ascii_art

import (
	ascii "ascii_art/pkg"
	"fmt"
	"html/template"
	"net/http"
	"strings"
)

// Return Error status code if an error occurred
func errorHandler(w http.ResponseWriter, r *http.Request, status int) {

	w.WriteHeader(status) // Right status code
	var templates string
	switch status {
	case http.StatusNotFound:
		templates = "templates/erreur404.html"
	case http.StatusInternalServerError:
		templates = "templates/erreur500.html"
	case http.StatusBadRequest:
		templates = "templates/erreur400.html"
	}
	tmpl, err := template.ParseFiles(templates)
	if err != nil {
		fmt.Println("pas de fichier erreur")
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Println("erreur lors du téléchargement de l'image")
	}
}

// Handle home and display the main page of the application
func home(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path != "/" {
		errorHandler(w, r, http.StatusNotFound)
		return
	}

	tmp := template.Must(template.ParseFiles("./templates/index.html")) // Create template of main page

	switch r.Method { // Compare request method
	case "GET":
		err := tmp.Execute(w, nil) // send template to client
		if err != nil {
			errorHandler(w, r, http.StatusInternalServerError)
			return
		}
	case "POST":
		r.ParseForm()                                              // parse form send by client
		banner_file := r.Form.Get("banner")                        // store banner from banner selector
		msg := strings.ReplaceAll(r.Form.Get("msg"), "\r\n", "\n") // store message from text area
		data, err := ascii.Process(msg, banner_file)               // Run ascii art program
		if err != nil {
			errorHandler(w, r, http.StatusInternalServerError)
			return
		}
		tmp.Execute(w, data) // Send new template with data in
	default:
		errorHandler(w, r, http.StatusBadRequest)
		return
	}
}

// Main handler how define each path
func Handlers() {

	http.HandleFunc("/", home)                                                                 // Main path
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static")))) // linked css

	fmt.Println("Listening...")
	http.ListenAndServe(":8080", nil)
}
