#!/bin/bash

#  Make sure Terraform is installed
(which terraform >> /dev/null) || echo "Terraform must be installed" && exit 1

# Make sure we have a credentials file
[ ! -f credentials ] && echo "Missing credentials file!" && exit 1

# Move credentials for application to access
cp credentials ./application

source credentials

terraform init
terraform apply -auto-approve -var routing_engine_url="http://router.project-osrm.org" -var geocoding_engine_url="https://nominatim.openstreetmap.org"