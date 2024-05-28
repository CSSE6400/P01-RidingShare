FROM pypy:3.9-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev postgresql-common gcc libgeos++-dev libgeos-3.9.0 libgeos-c1v5 libgeos-dev libgeos-doc openssl libcurl4-nss-dev libssl-dev curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn

# Setting the working directory
WORKDIR /app

# Install Python dependencies
RUN pypy3 -m pip install --prefer-binary --extra-index-url https://pypy.kmtea.eu/simple pycurl==7.43.0 numpy
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy our AWS credentials and consturct an entrypoint script for them
COPY credentials ./	
RUN printf '#!/bin/sh\n. ./credentials\nexec "$@"' > entrypoint.sh && \
    chmod +x entrypoint.sh

# Environment variables (you can also set these using an ARG or ENV in the Dockerfile)
RUN echo $ROUTING_API_URL

# Copy application code
COPY app /app

# Setup and build the frontend
WORKDIR /app/frontend
RUN yarn install && yarn build

# Return to the main work directory
WORKDIR /app

# Set up the entry point and default command
ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--preload"]
