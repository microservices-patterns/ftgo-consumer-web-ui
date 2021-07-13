#!/bin/bash -e

docker-compose up -d --build
#docker-compose exec web /bin/bash

echo "Testing the ports of containers using their expected names:"
docker port ftgoconsumerwebui_frontend_1
docker port ftgoconsumerwebui_backend_1
