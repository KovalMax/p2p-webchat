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
    Kind        MessageType `json:"kind,omitempty"`
    Source      string      `json:"source,omitempty"`
    Destination string      `json:"destination,omitempty"`
    Context     interface{} `json:"context,omitempty"`
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
        case registeredClient := <-a.register:
            a.clients[registeredClient.info.Id] = registeredClient
        case disconnectedClient := <-a.unregister:
            if _, ok := a.clients[disconnectedClient.info.Id]; ok {
                delete(a.clients, disconnectedClient.info.Id)
                close(disconnectedClient.sent)
            }
        case clientEvent := <-a.events:
            a.sendEvent(clientEvent)
        }
    }
}

func (a *Application) Logger() {
    err := <-a.errors
    log.Printf("Error from errChan listener. %q. Type %T", err.Error(), err)
}

func (a *Application) sendEvent(event *MessageEvent) {
    switch event.message.Kind {
    case OnlineClients:
        client, ok := a.clients[event.message.Source]
        if !ok {
            return
        }

        var online []*ClientInfo
        for _, val := range a.clients {
            online = append(online, val.info)
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
