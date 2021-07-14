#!/bin/bash -e

docker-compose up -d --build
sleep 10
docker-compose logs
docker-compose ps
#docker-compose exec web /bin/bash
