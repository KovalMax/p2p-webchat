package main

import (
	"log"
	"net/http"

	"maxkoval.net.ua/websocket/internal/hub"
)

const (
	websocketRoute string = "/messenger"
	httpPort       string = ":8080"
)

func main() {
	clientHub := hub.NewClientHub()
	go clientHub.Start()

	http.HandleFunc(
		websocketRoute,
		clientHub.HandleNewConnection,
	)

	log.Fatalln(http.ListenAndServe(httpPort, nil))
}
