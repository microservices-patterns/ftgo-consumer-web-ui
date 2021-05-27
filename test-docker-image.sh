#!/bin/bash -e

FTGO_BACKEND_API_URL=http://localhost:8080 ./start-http-server.sh

./wait-for-services.sh
