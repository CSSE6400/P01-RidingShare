#!/bin/bash

# Prompt the user for the API endpoint
echo "Please enter the API endpoint:"
read API_ENDPOINT

# Validate the input to ensure it's not empty
if [[ -z "$API_ENDPOINT" ]]
then
    echo "No API endpoint provided, exiting..."
    exit 1
fi

# Check if k6 is installed
if ! command -v k6 &> /dev/null
then
    echo "k6 could not be found, please install it first."
    exit 1
fi

# Execute the k6 test
echo "Running k6 test for the endpoint: $API_ENDPOINT"
k6 run -e ENDPOINT=$API_ENDPOINT k6.js

echo "k6 test execution completed."
