#!/bin/bash

# Ensure we have our credentials
[ ! -f credentials ] && echo "Missing credentials file!" && exit 1

# Move credentials for application to access
cp credentials ./application

source credentials

terraform init
terraform apply -auto-approve