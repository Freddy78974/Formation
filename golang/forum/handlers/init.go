package handlers

import (
	"database/sql"
	"log"
	"os"
	"strings"
	"text/template"

	_ "github.com/mattn/go-sqlite3"
)

var (
	Tmpl    *template.Template
	Db      *sql.DB
	Queries []string
)

// Initialisation des fichiers template
func InitTmpl() {
	Tmpl = template.Must(template.ParseGlob("./template/*.html"))

}

// Inisialisation de la database
func InitSql() (*sql.DB, error) {
	Db, err := sql.Open("sqlite3", "./db/db.sqlite")
	if err != nil {
		return nil, err
	}
	// defer Db.Close()
	// Lecture du fichier contenant les queries pour l'initialisation de la database
	initFile, err := os.ReadFile("queries/init.sql")
	if err != nil {
		panic(err)
	}
	// Execution de toutes les queries du fichier init
	_, err = Db.Exec(string(initFile))
	if err != nil {
		log.Fatalf("%q: %s\n", err, string(initFile))
	}
	return Db, err
}
func InitQueries() error {
	queries, err := os.ReadFile("queries/queries.sql")
	if err != nil {
		return err
	}

	Queries = strings.Split(strings.ReplaceAll(string(queries), "\r", ""), "\n")
	return nil
}
