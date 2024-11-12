package main

import (
	ascii "Ascii/utils"
	"fmt"
	"html/template"
	"net/http"
	"strings"
)

var (
	erreur400TemplateFile = "../templates/erreur400.html"
	erreur404TemplateFile = "../templates/erreur404.html"
	erreur500TemplateFile = "../templates/erreur500.html"
	indexTemplateFile     = "../templates/INDEX.html"
)

func PageHtml(w http.ResponseWriter, r *http.Request) {
	// Redirection si l'URL contient plusieurs occurrences de "/INDEX.html"
	if strings.Contains(r.URL.Path, "../INDEX.html") {
		http.Redirect(w, r, "../INDEX.html", http.StatusFound)
		return
	}

	if r.URL.Path == "/" || r.URL.Path == "/INDEX.html" {
		t := template.Must(template.ParseFiles(indexTemplateFile))
		switch r.Method {
		case "GET":
			err := t.Execute(w, nil)
			if err != nil {
				fmt.Println("error")
			}
		case "POST":
			r.ParseForm()
			banner := r.FormValue("banner")
			fmt.Println(banner)
			str := strings.ReplaceAll(r.FormValue("str"), "\r\n", "\n")
			fmt.Println(str)
			if str == "" {
				http.ServeFile(w, r, erreur400TemplateFile)
				return
			}
			for i := 0; i < len(str); i++ {
				if !isValidCaractere(rune(str[i])) {
					erreur(w, r, http.StatusInternalServerError)
					return
				}
			}
			result := ascii.Process(str, banner)
			fmt.Println(result)
			data := struct {
				Result string
			}{
				Result: result,
			}
			err := t.Execute(w, data)
			if err != nil {
				fmt.Println("error")
				return
			}
		default:
			erreur(w, r, http.StatusBadRequest)
			return
		}
	} else {
		erreur(w, r, http.StatusNotFound)
		return
	}
}

func erreur(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	var templateFile string
	switch status {
	case http.StatusBadRequest:
		templateFile = erreur400TemplateFile
	case http.StatusNotFound:
		templateFile = erreur404TemplateFile
	case http.StatusInternalServerError:
		templateFile = erreur500TemplateFile
	default:
		templateFile = "../templates/erreur.html"
	}
	tmpl, err := template.ParseFiles(templateFile)
	if err != nil {
		http.Error(w, "Erreur de chargement de la page d'erreur personnalisée", http.StatusInternalServerError)
		return
	}
	err = tmpl.ExecuteTemplate(w, "erreur500.html", nil)
	if err != nil {
		err = tmpl.ExecuteTemplate(w, "erreur404.html", nil)
		return
	}
}

func isValidCaractere(s rune) bool {
	if (s >= 32 && s <= 126) || s == '\n' {
		return true
	}
	return false
}

func main() {
	println("Server is running on http://localhost:8080")
	http.HandleFunc("/", PageHtml)
	http.ListenAndServe(":8080", nil)
}
