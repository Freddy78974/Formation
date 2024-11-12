package main

import (
	"log"
	"os"
	"real-time-forum/server"
)

func main() {
	args := os.Args[1:]
	for _, arg := range args {
		if arg == "clearDB" {
			if _, err := os.Stat("./rts.db"); err == nil {
				e := os.Remove("./rts.db")
				if e != nil {
					log.Fatal(e)
				}
			}
		}
	}
	go server.HandleMessages()
	server.InitServer()
}
