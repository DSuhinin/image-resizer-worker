.DEFAULT_GOAL := build
.PHONY: build_docker_image
.PHONY: run_application stop_application
.PHONY: prettify
.PHONY: help

#
# Project-specific variables
#
# Service name. Used for binary name, docker-compose service name, etc...
SERVICE=image-resizer-worker

#
# General variables
#
# Path to Docker file.
PATH_DOCKER_FILE=$(realpath ./docker/Dockerfile)
# Path to docker-compose file
PATH_DOCKER_COMPOSE_FILE=$(realpath ./docker/docker-compose.yml)
# Docker compose starting options.
DOCKER_COMPOSE_OPTIONS= -f $(PATH_DOCKER_COMPOSE_FILE)

build_docker_image: ## Build Application Docker Image.
	@echo ">>> Building docker image."
	docker build \
		-t $(SERVICE) \
		-f $(PATH_DOCKER_FILE) \
		. --no-cache

run_application: build_docker_image ## Run Application.
	@echo ">>> Starting up service container."
	@docker-compose $(DOCKER_COMPOSE_OPTIONS) up -d $(SERVICE)

stop_application: ## Stop Application.
	@docker-compose $(DOCKER_COMPOSE_OPTIONS) down -v --remove-orphans

prettify: ## Run code prettier.
	@npx prettier --write .

help: ## Display this help
	@ echo "Please use \`make <target>' where <target> is one of:"
	@ echo
	@ grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[36m%-10s\033[0m - %s\n", $$1, $$2}'
	@ echo