package main

import (
    "log"
    "net/http"

    "maxkoval.net.ua/websocket/application"
)

const (
    WebsocketRoute string = "/messenger"
    HttpPort string = ":8080"
)

func main() {
    errChan := make(chan error)
    app := application.NewApplication(errChan)
    go app.Start()
    go app.Logger()

    http.HandleFunc(WebsocketRoute, func(w http.ResponseWriter, r *http.Request) {
        application.HandleNewConnection(app, w, r)
    })

    log.Fatalln(http.ListenAndServe(HttpPort, nil))
}
