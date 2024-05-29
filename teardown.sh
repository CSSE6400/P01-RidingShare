#!/bin/bash

# Ensure we have our credentials
[ ! -f credentials ] && echo "Missing credentials file!" && exit 1

source credentials

terraform destroy -auto-approve