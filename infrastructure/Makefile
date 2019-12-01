APP_NAME ?= "messenger"

## Commands ##
start:
	@bash scripts/start.sh $(APP_NAME)

stop:
	@bash scripts/stop.sh $(APP_NAME)

exec:
	docker-compose -p $(APP_NAME) exec $(RUN_ARGS)