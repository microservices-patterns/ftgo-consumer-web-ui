#!/bin/bash -e

docker-compose up -d --build
docker-compose logs
docker-compose ps
#docker-compose exec web /bin/bash
