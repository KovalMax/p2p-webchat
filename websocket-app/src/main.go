package main

import (
    "log"
    "net/http"

    "maxkoval.net.ua/websocket/application"
)

func main() {
    errChan := make(chan error)
    app := application.NewApplication(errChan)
    go app.Start()
    go app.Logger()

    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        application.HandleNewConnection(app, w, r)
    })

    log.Fatalln(http.ListenAndServe(":8080", nil))
}
