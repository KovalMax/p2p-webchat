package main

import (
	"log"
	"net/http"
	"os"

	"maxkoval.net.ua/websocket/internal/hub"
)

func main() {
	clientHub := hub.NewClientHub()
	go clientHub.Start()

	websocketRoute := os.Getenv("SOCKET_ROUTE")
	http.HandleFunc(
		websocketRoute,
		clientHub.HandleNewConnection,
	)

	httpPort := os.Getenv("SOCKET_PORT")
	log.Fatalln(
		http.ListenAndServe(httpPort, nil),
	)
}
