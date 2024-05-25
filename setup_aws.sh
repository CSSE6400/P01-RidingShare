#!/bin/bash

if ! (aws --version >> /dev/null); then
	# Install the AWS cli tool
	curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
	unzip awscliv2.zip
	sudo ./aws/install
	rm awscliv2.zip

	# Create a blank credentials to source
	touch credentials
	chmod +x credentials

	# Set the default region
	touch ~/.aws/config
	echo "[default]" > ~/.aws/config
	echo "region = us-east-1" >> ~/.aws/config
fi
