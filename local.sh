#!/bin/bash

# Make a blank credentials and move it
touch credentials
cp credentials ./application

# Change into correct directory
cd application

# Buildkit to make sure we know what env
export DOCKER_BUILDKIT=1

# Run the docker container in the background and remove after its closed.
docker-compose up --build -d