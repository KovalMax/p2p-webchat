package application

import (
    "log"
)

type Application struct {
    errors     chan error
    events     chan *MessageEvent
    register   chan *Client
    unregister chan *Client
    clients    map[string]*Client
}

type MessageEvent struct {
    messageType int
    message     *Message
}

type MessageType int

const (
    SendMessage MessageType = iota + 1
    OnlineClients
    NewConnection
)

type Message struct {
    Kind        MessageType
    Source      string
    Destination string
    Context     interface{}
}

func NewApplication(ech chan error) *Application {
    return &Application{
        ech,
        make(chan *MessageEvent),
        make(chan *Client),
        make(chan *Client),
        make(map[string]*Client),
    }
}

func (a *Application) Start() {
    for {
        select {
        case newClient := <-a.register:
            a.clients[newClient.info.id] = newClient
        case closedClient := <-a.unregister:
            delete(a.clients, closedClient.info.id)
            close(closedClient.sent)
        case event := <-a.events:
            a.sendEvent(event)
        }
    }
}

func (a *Application) Logger() {
    err := <-a.errors
    log.Fatalf("Error from errChan listener. %q. Type %T", err.Error(), err)
}

func (a *Application) sendEvent(event *MessageEvent) {
    switch event.message.Kind {
    case OnlineClients:
        client, ok := a.clients[event.message.Source]
        if !ok {
            return
        }

        online := make(map[string]string)
        for id, val := range a.clients {
            online[id] = val.info.name
        }
        event.message.Context = online
        client.sent <- event
    case SendMessage:
        client, ok := a.clients[event.message.Destination]
        if !ok {
            return
        }
        client.sent <- event
    }

}
