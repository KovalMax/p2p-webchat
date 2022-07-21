package hub

import (
	"errors"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type ClientHub struct {
	events     chan *MessageEvent
	register   chan *Client
	unregister chan *Client
	clients    map[string]*Client
}

type Hub interface {
	Start()
	HandleNewConnection(w http.ResponseWriter, r *http.Request)
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
	RemoveConnection
)

type Message struct {
	Kind        MessageType `json:"kind,omitempty"`
	Source      string      `json:"source,omitempty"`
	Destination string      `json:"destination,omitempty"`
	Context     interface{} `json:"context,omitempty"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func NewClientHub() Hub {
	return &ClientHub{
		make(chan *MessageEvent),
		make(chan *Client),
		make(chan *Client),
		make(map[string]*Client),
	}
}

func (a *ClientHub) Start() {
	log.Println("Up and running")
	for {
		select {
		case registeredClient := <-a.register:
			id := registeredClient.info.Id
			a.clients[id] = registeredClient
			a.createAndSendNewEvent(NewConnection, id, registeredClient.info.Name)
		case disconnectedClient := <-a.unregister:
			id := disconnectedClient.info.Id
			if client, ok := a.clients[id]; ok {
				_ = client.conn.Close()
				delete(a.clients, id)
				close(disconnectedClient.sent)
				a.createAndSendNewEvent(RemoveConnection, id, disconnectedClient.info.Name)
			}
		case clientEvent := <-a.events:
			a.sendEvent(clientEvent)
		}
	}
}

func (a *ClientHub) HandleNewConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		handleError("Failed to upgrade connection", err)

		return
	}

	id := r.URL.Query().Get("clientId")
	name := r.URL.Query().Get("clientName")
	if id == "" || name == "" {
		handleError("new connection error", errors.New("client information not found"))

		return
	}

	client := NewClient(
		id,
		name,
		a,
		conn,
	)

	// Read and writes for websocket are doing in a separate per-connection goroutines
	go client.writer()
	go client.reader()

	a.register <- client
}

func (a *ClientHub) createAndSendNewEvent(kind MessageType, source string, name string) {
	a.sendEvent(
		&MessageEvent{
			1,
			&Message{
				Kind:    kind,
				Source:  source,
				Context: name,
			},
		},
	)
}

func (a *ClientHub) sendEvent(event *MessageEvent) {
	switch event.message.Kind {
	case NewConnection, RemoveConnection:
		for _, client := range a.clients {
			if event.message.Source == client.info.Id {
				continue
			}

			client.sent <- event
		}
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
