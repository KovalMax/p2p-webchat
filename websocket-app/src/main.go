package main

import (
    "log"
    "net/http"

    "maxkoval.net.ua/websocket/application"
)

func main() {
    errChan := make(chan error)
    go func() {
        err := <-errChan
        log.Printf("Error from errChan listener. %q. Type %T", err.Error(), err)
    }()

    app := application.NewApplication(errChan)
    go app.Run()

    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        application.NewClientConnection(app, w, r)
    })

    log.Fatalln(http.ListenAndServe(":8080", nil))
}
