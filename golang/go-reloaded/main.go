package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Println("Please provide the input and output file names as arguments.")
	}
	input := os.Args[1]
	output := os.Args[2]
	content, err := os.ReadFile(input)
	if err != nil {
		panic(err)
	}
	words := strings.Split(string(content), " ")
	for i := 0; i < len(words); i++ {
		if strings.Contains(words[i], "(hex)") {
			hex := words[i-1]
			dec, err := strconv.ParseInt(hex, 16, 64)
			if err != nil {
				panic(err)
			}
			var val string
			val = strconv.FormatInt(dec, 10)
			words[i-1] = val
			words[i] = ""
		} else if strings.Contains(words[i], "(bin)") {
			bin := words[i-1]
			dec, err := strconv.ParseInt(bin, 2, 64)
			if err != nil {
				panic(err)
			}
			var val string
			val = strconv.FormatInt(dec, 10)
			words[i-1] = val
			words[i] = ""
		} else if strings.Contains(words[i], "(up") {
			if words[i] == "(up," {
				howmuch := words[i+1][:len(words[i+1])-1]
				howmuch2, err := strconv.Atoi(howmuch)
				if err != nil {
					panic(err)
				}
				for nb := howmuch2; nb > 0; nb-- {
					words[i-nb] = strings.ToUpper(words[i-nb])
				}

				words[i] = ""
				words[i+1] = ""

			} else if words[i] == "(up)" {
				words[i] = ""
				words[i-1] = strings.ToUpper(words[i-1])
			}
		} else if strings.Contains(words[i], "(cap") {
			if words[i] == "(cap," {
				howmuch := words[i+1][:len(words[i+1])-1]
				howmuch2, err := strconv.Atoi(howmuch)
				if err != nil {
					panic(err)
				}
				for nb := howmuch2; nb > 0; nb-- {
					words[i-nb] = strings.Title(words[i-nb])
				}

				words[i] = ""
				words[i+1] = ""
			} else if words[i] == "(cap)" {
				words[i] = ""
				words[i-1] = strings.Title(words[i-1])
			}
		} else if strings.Contains(words[i], "(low") {
			if words[i] == "(low," {
				howmuch := words[i+1][:len(words[i+1])-1]
				howmuch2, err := strconv.Atoi(howmuch)
				if err != nil {
					panic(err)
				}
				for nb := howmuch2; nb > 0; nb-- {
					words[i-nb] = strings.ToLower(words[i-nb])
				}

				words[i] = ""
				words[i+1] = ""
			} else if words[i] == "(low)" {
				words[i] = ""
				words[i-1] = strings.ToLower(words[i-1])
			}
		}
	}

	tob := true
	for i, str := range words {
		if str == "'" && tob == true {
			ToRight(words, i)
			tob = false
		} else if str == "'" && tob == false {
			ToLeft(words, i)
			tob = true
		}
	}

	for i, str := range words {
		if str == "," {
			words[i-1] = words[i-1] + ","
			words[i] = ""
		}
	}

	for i := range words {
		if strings.Contains(words[i], ",") && string(words[i][0]) == "," && len(words) >= 2 {
			words[i] = words[i][1:]
			words[i-1] = words[i-1] + ","
		}
	}

	for i, str := range words {
		if str == "." {
			words[i-1] = words[i-1] + "."
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == "!" {
			words[i-1] = words[i-1] + "!"
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == "!?" {
			words[i-1] = words[i-1] + "!?"
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == ":" {
			words[i-1] = words[i-1] + ":"
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == ";" {
			words[i-1] = words[i-1] + ";"
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == "?" {
			words[i-1] = words[i-1] + "?"
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == "'" {
			words[i-1] = words[i-1] + "'"
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == "`" {
			words[i-1] = words[i-1] + "`"
			words[i] = ""
		}
	}
	for i, str := range words {
		if str == "a" {
			if string(words[i+1][0]) == "a" || string(words[i+1][0]) == "e" || string(words[i+1][0]) == "i" || string(words[i+1][0]) == "o" || string(words[i+1][0]) == "u" || string(words[i+1][0]) == "h" || string(words[i+1][0]) == "A" || string(words[i+1][0]) == "E" || string(words[i+1][0]) == "I" || string(words[i+1][0]) == "O" || string(words[i+1][0]) == "U" || string(words[i+1][0]) == "H" {
				words[i] = "an"
			}
		}
	}
	for i, str := range words {
		if str == "A" {
			if string(words[i+1][0]) == "a" || string(words[i+1][0]) == "e" || string(words[i+1][0]) == "i" || string(words[i+1][0]) == "o" || string(words[i+1][0]) == "u" || string(words[i+1][0]) == "h" || string(words[i+1][0]) == "A" || string(words[i+1][0]) == "E" || string(words[i+1][0]) == "I" || string(words[i+1][0]) == "O" || string(words[i+1][0]) == "U" || string(words[i+1][0]) == "H" {
				words[i] = "An"
			}
		}
	}

	var array []string
	previous := ""

	for _, str := range words {
		if WithoutSpaces := strings.TrimSpace(str); WithoutSpaces != "" {
			if WithoutSpaces == "." || WithoutSpaces == "," || WithoutSpaces == "!" || WithoutSpaces == "?" || WithoutSpaces == ":" || WithoutSpaces == ";" ||
				WithoutSpaces == "..." || WithoutSpaces == "!?" || WithoutSpaces == ".'" || WithoutSpaces == "'" {
				previous += WithoutSpaces
			} else {
				if previous != "" {
					array = append(array, previous)
				}
				previous = WithoutSpaces
			}
		}
	}
	if previous != "" {
		array = append(array, previous)
	}
	string := strings.Join(array, " ")
	fmt.Println(string)
	e := os.Remove(output)
	if e != nil {
		log.Fatal(e)
	}
	f, err := os.OpenFile(output,
		os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		log.Println(err)
	}

	defer f.Close()
	if _, err := f.WriteString(string); err != nil {
		log.Println(err)
	}
}

func ToLeft(arr []string, i int) {
	arr[i] = ""
	arr[i-1] = arr[i-1] + "'"
}

func ToRight(arr []string, i int) {
	arr[i] = ""
	arr[i+1] = "'" + arr[i+1]
}
