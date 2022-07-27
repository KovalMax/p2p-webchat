## P2P web chat
### Simple implementation of P2P messaging web-application
### Technologies used:

- golang + gorilla-websocket - for real time communication
- angular - for frontend part
- php8 + symfony5 - for authentication, registration and DB related part

### Local development using docker-compose
#### Building the project using make commands from root of project
#### Run `make help` for full list of commands
#### `infrastructure/.env` - for configuration of applications
#### `infrastructure/.env.dist` - example with all needed values for startup
#### `infrastructure/docker-compose.override.yml` - for custom container settings volumes, port bindings, etc
#### `infrastructure/docker-compose.override.dist.yml` - example with all needed values for local development

P.S.
During `make start` or `make build` - `.env` and `docker-compose.override.yml` will be copied from dist files if not exists in infrastructure folder

### Development plan :dart:

- Authentication :white_check_mark:
- Registration :white_check_mark:
- Users online :white_check_mark:
- Room with 1-1/p2p messaging :x:
- Storing messages :x:
- Loading history for chat rooms :x:
