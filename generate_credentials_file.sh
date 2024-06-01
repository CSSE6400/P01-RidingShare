#!/bin/bash

# Construct a credentials file
if [ ! -f credentials ]; then
	echo "Generating credentials file"
	touch credentials
else 
	echo "You already have a credentials file"
fi

