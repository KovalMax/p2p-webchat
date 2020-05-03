FROM golang:1.14-alpine3.11 AS build

WORKDIR /go/app
COPY ./src .

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:3.11
RUN apk --no-cache add ca-certificates

WORKDIR /usr/bin
COPY --from=build /go/app/main /usr/bin/server

ENTRYPOINT /usr/bin/server