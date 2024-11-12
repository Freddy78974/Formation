package main

import (
	"bufio"
	"fmt"
	"os"
	"time"
)

func main() {
	argument := os.Args[1:]
	if len(argument) == 2 && IsBanner(argument[1]) {
		str := argument[0]
		str2 := argument[1]
		verificationRetourLigne(str, str2)
	} else {
		fmt.Println("Usage: go run . [STRING] [BANNER]\n\nEX: go run . something standard")
		return
	}
}
func IsBanner(Ban string) bool {
	return Ban == "standard" || Ban == "shadow" || Ban == "thinkertoy"
}

// fonction pour lire une ligne d'un fichier
func readLine(lineNum int, str2 string) (line string) {
	// Ouverture du fichier
	file, _ := os.Open(SelectFont(str2))
	// Création d'un scanner
	sc := bufio.NewScanner(file)
	lastLine := 0
	// Scan du fichier
	for sc.Scan() {
		// fmt.Println(sc.Text())
		lastLine++
		// Si la ligne correspond, récupération de la ligne
		if lastLine == lineNum {
			temp := sc.Text()
			file.Close()
			return temp
		}
	}
	return line
}

// fonction de print
func printmot(str string, str2 string) {
	nbr := 0
	tmp := ""
	for i := 0; i < 8; i++ {
		for _, v := range str {
			// nbr permet de savoir a quel ligne se trouve la lettre
			nbr = i + (int(v)-32)*9 + 2
			// ajout de toutes les lignes dans tmp
			tmp = tmp + readLine(nbr, str2)
		}
		// print de la ligne
		fmt.Println(tmp)
		tmp = ""
	}
}

// fonction pour gérer les \n
func verificationRetourLigne(str string, str2 string) {
	vide := true
	tmp := ""
	for i := 0; i < len(str); i++ {
		// si presence d'un '\n' et vide == true (ce n'ai pas le 1er '\n'), print d'un retour a la ligne
		if str[i] == '\\' && str[i+1] == 'n' && vide == true {
			fmt.Println()
			i++
			// si presence d'un '\n' et vide == false (1er '\n'), print du mot et passage de vide à true si suivi d'un autre '\n'
		} else if str[i] == '\\' && str[i+1] == 'n' {
			printmot(tmp, str2)
			time.Sleep(30 * time.Millisecond)
			tmp = ""
			i++
			vide = true
		} else {
			// print du mot et passage de vide à false pour gérer les '\n'
			tmp = tmp + string(str[i])
			vide = false
		}
	}
	if vide == false {
		printmot(tmp, str2)
		time.Sleep(30 * time.Millisecond)
	}
}

func SelectFont(str2 string) string {
	switch str2 {
	case "standard":
		return "standard.txt"
	case "shadow":
		return "shadow.txt"
	case "thinkertoy":
		return "thinkertoy.txt"
	default:
		return "standard.txt"
	}

}
