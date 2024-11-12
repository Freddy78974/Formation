package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
)

// Structure pour représenter un artiste
type Artist struct {
	Name       string   `json:"name"`
	Image      string   `json:"image"`
	StartYear  int      `json:"creationDate"`
	FirstAlbum string   `json:"firstAlbum"`
	Members    []string `json:"members"`
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl := template.Must(template.ParseFiles("templates/index.html"))

		// URL de l'API des artistes
		artistsURL := "https://groupietrackers.herokuapp.com/api/artists"

		// Appeler l'API et décodez les données
		artistsData, err := fetchDataFromAPI(artistsURL)
		if err != nil {
			fmt.Println("Erreur lors de la récupération des artistes:", err)
			return
		}

		var artists []Artist
		if err := json.Unmarshal(artistsData, &artists); err != nil {
			fmt.Println("Erreur lors du décodage des données des artistes:", err)
			return
		}

		// Parcours des artistes pour afficher les informations
		for _, artist := range artists {
			fmt.Printf("Artiste: %s\n", artist.Name)
			fmt.Printf("Année de début: %d\n", artist.StartYear)
			fmt.Printf("Premier album: %s\n", artist.FirstAlbum)
			fmt.Printf("Membres du groupe: %v\n", artist.Members)
			fmt.Println("-----------")
		}

		// Exécutez le modèle de template avec les données
		tmpl.Execute(w, artists)
	})

	// Démarrer le serveur
	println("Serveur démarré sur http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func fetchDataFromAPI(url string) ([]byte, error) {
	response, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("réponse de statut non valide: %s", response.Status)
	}

	responseData, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	return responseData, nil
}
