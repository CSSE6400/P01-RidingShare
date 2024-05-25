#!/bin/bash

source credentials

terraform init
terraform apply -auto-approve