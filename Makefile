
IMAGE_NAME  := custom-server-express
NETWORK     := app-net
MONGO_NAME  := mongo-top10
SERVER_NAME := custom-server-express
MONGO_URI   := mongodb://mongo-top10:27017/musicdb

.PHONY: help build network run down logs clean

help:
	@echo "custom-server-express (plain Docker, no docker-compose):"
	@echo "  make build   - Build the Docker image"
	@echo "  make network - Create Docker network app-net"
	@echo "  make run     - Build, create network, run mongo + server"
	@echo "  make down    - Stop and remove mongo + server containers"
	@echo "  make logs    - Follow server logs (Ctrl+C to exit)"
	@echo "  make clean   - Stop containers, remove image and volumes"

build:
	docker build -t $(IMAGE_NAME) .

network:
	-docker network create $(NETWORK)

run: clean build network
	@echo "Creating volumes if needed..."
	-docker volume create mongo-data
	-docker volume create form-data
	@echo "Starting MongoDB..."
	docker run -d --name $(MONGO_NAME) --network $(NETWORK) -p 27017:27017 -v mongo-data:/data/db mongo:6
	@echo "Starting Express server..."
	docker run -d --name $(SERVER_NAME) --network $(NETWORK) -p 8080:80 -e MONGO_URI=$(MONGO_URI) -v form-data:/app/data $(IMAGE_NAME)
	@echo "Done. Open http://localhost:8080"

down:
	-docker stop $(SERVER_NAME) $(MONGO_NAME)
	-docker rm $(SERVER_NAME) $(MONGO_NAME)

logs:
	docker logs -f $(SERVER_NAME)

clean: down
	-docker rmi $(IMAGE_NAME)
	-docker volume rm form-data mongo-data
