#!/bin/bash

# Check if the host argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <host>"
  exit 1
fi

# The host URL passed as the first argument
HOST=$1

# Directory where you want to clone and run sqlmap
WORKDIR="/tmp/sqlmap-test"

# Create working directory
mkdir -p $WORKDIR
cd $WORKDIR

# Clone the sqlmap repository
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git
cd sqlmap

# Create the request.txt file using the provided HOST
cat <<EOF >request.txt
POST /profile HTTP/1.1
Host: $HOST
Content-Type: application/json

{"username": "test", "password": "test", "user_type": "driver"}
EOF

# Run sqlmap specifically targeting PostgreSQL
python sqlmap.py -r request.txt --dbms=PostgreSQL --level=5 --risk=3 --batch --random-agent --tamper=space2comment


# Cleanup: delete the sqlmap directory
cd ..
rm -rf sqlmap

# Optional: remove the work directory
# rm -rf $WORKDIR
