.DEFAULT_GOAL := help

ifeq (exec,$(firstword $(MAKECMDGOALS)))
  # use the rest as arguments for "run"
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(RUN_ARGS):;@:)
endif

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: start
start: ## - Starting all docker containers from compose file
	make -C infrastructure start

.PHONY: stop
stop: ## - Stop all docker containers from compose file
	make -C infrastructure stop

.PHONY: build
build: ## - build all docker containers from compose file
	make -C infrastructure build

.PHONY: exec
exec: ## - Exec some docker container e.g. make exec backend sh (backend just a service name from compose file)
	make -C infrastructure exec $(RUN_ARGS)

copy_node_modules: ## - Copying node modules from container to host machine
	@docker cp messenger_frontend:/home/app/node_modules frontend-app/node_modules
