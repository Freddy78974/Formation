package handlers

import (
	"net/http"
)

func Erreur(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	switch status {
	case http.StatusBadRequest:
		Tmpl.Execute(w, "../template/erreur400.html")
	case http.StatusInternalServerError:
		Tmpl.Execute(w, "../template/erreur500.html")
	default:
		Tmpl.Execute(w, "./templates/erreur400.html")
	}

}
