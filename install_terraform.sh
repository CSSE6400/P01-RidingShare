#!/bin/bash

# If already installed stop
if (which terraform >> /dev/null); then
	printf "Terraform already installed\n"
	exit 0
fi

# Script only supports apt package manager
if ! (which apt >> /dev/null); then
	printf "This script only supports apt - Must install manually sorry :(\n"
	exit 1
fi

# Install Terraform
printf "Installing Terraform\n"
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common

wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null

gpg --no-default-keyring \
--keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
--fingerprint

echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list

sudo apt update

sudo apt-get install terraform

