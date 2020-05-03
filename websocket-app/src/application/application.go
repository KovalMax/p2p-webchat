package application

type Application struct {
    errorChannel chan error
    broadcast    chan *MessageEvent
    register     chan *Client
    unregister   chan *Client
    clients      map[*Client]bool
}

type MessageEvent struct {
    messageType int
    message []byte
}

func NewApplication(ech chan error) *Application {
    return &Application{
        ech,
        make(chan *MessageEvent),
        make(chan *Client),
        make(chan *Client),
        make(map[*Client]bool),
    }
}

func (a *Application) Run() {
    for {
        select {
        case newClient := <-a.register:
            a.clients[newClient] = true
        case closedClient := <-a.unregister:
            delete(a.clients, closedClient)
            close(closedClient.sent)
        case event := <-a.broadcast:
            for client := range a.clients {
                client.sent <- event
            }
        }
    }
}
