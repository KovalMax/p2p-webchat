package application

import (
    "bytes"
    "log"
    "net/http"
    "time"

    "github.com/gorilla/websocket"
)

type Client struct {
    app  *Application
    conn *websocket.Conn
    sent chan *MessageEvent
}

const (
    // Time allowed to write a message to the peer.
    writeWait = 10 * time.Second

    // Time allowed to read the next pong message from the peer.
    pongWait = 60 * time.Second

    // Send pings to peer with this period. Must be less than pongWait.
    pingPeriod = (pongWait * 9) / 10

    // Maximum message size allowed from peer.
    maxMessageSize = 512
)

var (
    newline = []byte{'\n'}
    space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin:     func(r *http.Request) bool { return true },
}

func NewClientConnection(app *Application, w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        app.errorChannel <- err

        return
    }

    client := &Client{app, conn, make(chan *MessageEvent)}
    app.register <- client

    go client.writer()
    go client.reader()
}

func (c *Client) writer() {
    ticker := time.NewTicker(pingPeriod)
    defer func() {
        log.Println("Closing from writer defer")
        ticker.Stop()
        c.app.errorChannel <- c.conn.Close()
    }()

    for {
        select {
        case event, ok := <-c.sent:
            if !ok {
                if err := c.conn.WriteMessage(websocket.CloseMessage, nil); err != nil {
                    c.app.errorChannel <- err
                }

                return
            }

            if err := c.conn.WriteMessage(event.messageType, event.message); err != nil {
                c.app.errorChannel <- err

                return
            }
        case <-ticker.C:
            if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
                c.app.errorChannel <- err

                return
            }
        }
    }
}

func (c *Client) reader() {
    defer func() {
        c.app.unregister <- c
        c.app.errorChannel <- c.conn.Close()
    }()

    c.conn.SetReadLimit(maxMessageSize)
    c.conn.SetPongHandler(func(appData string) error { return nil })

    for {
        msgType, message, err := c.conn.ReadMessage()
        if err != nil {
            c.app.errorChannel <- err
            break
        }

        message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
        c.app.broadcast <- &MessageEvent{msgType, message}
    }
}
