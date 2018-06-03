#!/usr/bin/env bash

npm run docker-redis-stop
npm run docker-redis-run-master

node tests/redis-create-room.js
node tests/redis-sort-room.js

#docker exec -i -t redis-master /bin/bash | redis-cli