package server

import (
	"regexp"
	"strings"
)

func Slugify(text string) string {
	text = strings.ToLower(text)
	reg := regexp.MustCompile("[^a-z0-9]+")
	text = reg.ReplaceAllString(text, "-")
	text = strings.Trim(text, "-")
	return text
}
