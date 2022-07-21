package hub

import (
	"bytes"
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type ClientInfo struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

type Client struct {
	info *ClientInfo
	app  *ClientHub
	conn *websocket.Conn
	sent chan *MessageEvent
}

const (
	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

func NewClient(id, name string, app *ClientHub, conn *websocket.Conn) *Client {
	conn.SetPingHandler(nil)
	conn.SetPongHandler(nil)
	conn.SetCloseHandler(nil)
	conn.SetReadLimit(maxMessageSize)

	return &Client{
		info: &ClientInfo{
			id,
			name,
		},
		app:  app,
		conn: conn,
		sent: make(chan *MessageEvent),
	}
}

func (c *Client) writer() {
	defer c.closeClient()

	for {
		select {
		case event, ok := <-c.sent:
			if !ok {
				_ = c.conn.WriteMessage(websocket.CloseMessage, nil)

				return
			}

			encoded, err := json.Marshal(event.message)
			if err != nil {
				handleError("json marshalling failed", err)

				return
			}

			if err := c.conn.WriteMessage(event.messageType, encoded); err != nil {
				handleError("Can not send message from writer", err)

				return
			}
		}
	}
}

func (c *Client) reader() {
	defer c.closeClient()

	for {
		msgType, message, err := c.conn.ReadMessage()
		if err != nil {
			handleError("Error reading message from reader message", err)

			return
		}

		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		event, err := buildMessageEvent(message, msgType)
		if err != nil {
			handleError("Can not build message for read event", err)

			return
		}

		c.app.events <- event
	}
}

func (c *Client) closeClient() {
	c.app.unregister <- c
}

func buildMessageEvent(rawMessage []byte, msgType int) (*MessageEvent, error) {
	clientMessage := new(Message)
	if err := json.Unmarshal(rawMessage, clientMessage); err != nil {
		return nil, err
	}

	return &MessageEvent{msgType, clientMessage}, nil
}

func handleError(msg string, err error) {
	log.Printf("Got error %s, \n%q", msg, err.Error())
}
