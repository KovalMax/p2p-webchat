FROM golang:1.18-alpine3.16 AS base

# Do not rebuild C libs, no need to use gcc for building Go code
ENV CGO_ENABLED 0
# Do not supress stack trace gives more info about errors in runtime
ENV GOTRACEBACK system
# Build for linux os
ENV GOOS linux

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -a -installsuffix cgo -o /usr/bin/go_websocket cmd/main.go

FROM base as dev

RUN go install github.com/githubnemo/CompileDaemon@latest

ENTRYPOINT [ \
    "CompileDaemon", \
    "--build", "go build -a -installsuffix cgo -o /usr/bin/go_websocket cmd/main.go", \
    "--command", "/usr/bin/go_websocket" \
]

FROM alpine:3.16 as prod
RUN apk --no-cache add ca-certificates

WORKDIR /usr/bin
COPY --from=base /usr/bin/go_websocket .

CMD /usr/bin/go_websocket
