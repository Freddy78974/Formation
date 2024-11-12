package ascii

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// Process input data to get graphical data representation
func Process(msg, banner_file string) string {
	var tmp []string
	var out [][]string
	var split_msg []string

	out_str := ""
	if len(msg) == 0 {
		return ""
	}
	msg = strings.ReplaceAll(msg, `\n`, "\n")
	if len(msg) == 1 && msg[0] == '\n' { // Check if character is just '\n'
		return string(msg[0])
	} else {
		split_msg = strings.Split(msg, "\n") // Put each part of the string in array where '\n' generate an empty string in array
		for i := range split_msg {           // range over the string array
			if len(split_msg[i]) == 0 { // if index is empty we create a new line
				out_str += "\n"
			} else {
				for _, char := range split_msg[i] { // for each not empty index, take each characters
					tmp = ReadFile(SelectFs(banner_file), char) // and compare them with the source file
					out = append(out, tmp)                      // Create a array with ASCII characters matching to the rune
				}
				out_str += DisplayTab(out) // Convert and display the ASCII representation of the string in index
			}
			tmp, out = nil, nil // Purge the output variables before changing index
		}
	}
	return out_str
}

// Read ASCII file content and search match between rune value and the character representation
func ReadFile(filename string, char rune) []string {
	var tab []string
	var count int              // Initialize the cursor of the index of character
	line := int(char-32)*9 + 2 // Define lines numbers for ASCII character
	//ASCII_Value of te rune - 32(whitespace index) x 9(number of lines of representation of the character ) + 2('\n' at the begin and at the end of file)
	file, err := os.Open("../web/" + filename)
	if err != nil {
		fmt.Println("Error during reading file")
		return nil
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	for scanner.Scan() { // Range over the ASCII representation source file
		count++                               // Increment the cursor of hte index of character
		if count >= line && count <= line+7 { // Put in array the ASCII representation of th character if index
			tab = append(tab, scanner.Text()) // of the index of ASCII character matching with the ASCII value of the rune
		}
	}
	return tab
}

// Transform the array and format the output
func DisplayTab(tab [][]string) string {
	var out []string
	str := ""
	index := 0      // line's index of the representation of the character
	for index < 8 { // For each of the character representation
		for i := 0; i <= len(tab)-1; i++ { // range over the array of arrays
			out = append(out, (tab[i][index])) // Put the i line of each sub array into the output
		}
		out = append(out, "\n") // Display each next line below the current
		index++
	}
	for i := 0; i < len(out); i++ { // convert the output to a string
		str += out[i]
	}
	return str
}

// Function returns file of the font chosen
func SelectFs(str string) string {
	switch {
	case strings.Contains(str, "standard"):
		str += ".txt"
	case strings.Contains(str, "shadow"):
		str += ".txt"
	case strings.Contains(str, "thinkertoy"):
		str += ".txt"
	default:
		str += "standard.txt"
	}
	return str
}
