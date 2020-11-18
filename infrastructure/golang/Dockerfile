FROM golang:1.15-alpine3.12 AS build

# Do not rebuild C libs, no need to use gcc for building Go code
ENV CGO_ENABLED 0
# Do not supress stack trace gives more info about errors in runtime
ENV GOTRACEBACK system
# Build for linux os
ENV GOOS linux

WORKDIR /go/app
COPY ./src .

RUN go mod download
RUN go build -a -installsuffix cgo -o main .

FROM alpine:3.12
RUN apk --no-cache add ca-certificates

WORKDIR /usr/bin
COPY --from=build /go/app/main /usr/bin/server

ENTRYPOINT /usr/bin/server