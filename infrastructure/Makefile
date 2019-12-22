.DEFAULT_GOAL := help
.PHONY: help run stop

help:
	@echo ''
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
	@echo ''

KEYS := build exec
APP_NAME ?= "messenger"

define LOOPBODY
  ifneq ($$(filter $$(KEYS),$(v)),)
    RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    $(eval $(RUN_ARGS):;@:)
  endif
endef

$(foreach v,$(firstword $(MAKECMDGOALS)),$(eval $(LOOPBODY)))

## Commands:
start: ## - Starting all docker containers
	cp -n .env.dist .env || true
	cp -n docker-compose.override.dist.yml docker-compose.override.yml || true
	@bash scripts/start.sh $(APP_NAME)

stop: ## - Stop all docker containers
	@bash scripts/stop.sh $(APP_NAME)

exec: ## - Exec some container e.g. make exec app-fpm sh
	docker-compose -p $(APP_NAME) exec $(RUN_ARGS)
%:
@: