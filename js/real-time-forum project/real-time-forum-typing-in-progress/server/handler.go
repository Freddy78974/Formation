package server

import (
	"html/template"
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("./web/template/index.html")
	t.Execute(w, nil)
}
