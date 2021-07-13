#!/bin/bash -e

docker-compose up -d --build
docker-compose ps
docker-compose logs
#docker-compose exec web /bin/bash
