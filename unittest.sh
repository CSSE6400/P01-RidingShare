#!/bin/bash

# Navigate to the application directory where docker-compose.yml is located
cd application

# Start only the database service
docker-compose up -d database redis matching_worker

# Wait for 10 seconds to allow the database to initialize
echo "Waiting for the database service to initialize... Sleeping for 20 seconds"
sleep 20

export SQLALCHEMY_DATABASE_URI=postgresql+psycopg://administrator:verySecretPassword@localhost:5432/ride
export CELERY_BROKER_URL=redis://localhost:6379

# Navigate to the tests directory and run unittests
echo "Running tests..."
cd app/tests
python -W ignore -m unittest discover

# Navigate back to the application directory
echo "Shutting down services..."
cd ../../..

# Shut down all services
./cleanup.sh
./purge_db.sh
echo "Testing and cleanup completed."
