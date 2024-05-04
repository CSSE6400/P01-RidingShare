#!/bin/bash

# Change into correct directory
cd application

# Buildkit to make sure we know what env
export DOCKER_BUILDKIT=1

# Ensure we clean up our containers
docker compose down