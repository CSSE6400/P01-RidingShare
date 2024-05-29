#!/bin/bash

# If already installed stop
if (which aws >> /dev/null); then
	printf "AWS cli already installed\n"
	exit 0
fi

# Find what type of OS this is (Linux or Mac)
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
	*)          printf "Unsupported machine for script\n" && exit 1
esac

# Install the cli based on OS
printf "Installing AWS cli"
if [ "$machine" == "Linux" ] ; then
	printf " - For Linux\n"
	# Install the AWS cli tool for linux
	curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
	unzip awscliv2.zip
	sudo ./aws/install
	rm awscliv2.zip


elif [ "$machine" == "Mac" ] ; then
	printf " - For Mac\n"
	# Install the AWS cli tool for mac
	curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
	sudo installer -pkg AWSCLIV2.pkg -target /
	rm "AWSCLIV2.pkg"
fi

# Create a blank credentials to source
touch credentials
chmod +x credentials

# Set the default region
mkdir -p ~/.aws
touch ~/.aws/config
printf "[default]\nregion = us-east-1" >> ~/.aws/config
