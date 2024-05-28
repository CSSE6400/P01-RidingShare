FROM pypy:3.9-slim

# Installing dependencies for running the application
RUN apt-get update && apt-get install -y libpq-dev postgresql-common gcc libgeos++-dev libgeos-3.9.0 libgeos-c1v5 libgeos-dev libgeos-doc
RUN apt-get install -y openssl libcurl4-nss-dev libssl-dev curl

# Install NVM to manage installing npm 20 and Yarn
ENV NVM_DIR "$HOME/.nvm"
RUN mkdir -p ${NVM_DIR}
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN /bin/bash -c "source ~/.bashrc && nvm install 20 && npm install --global yarn"

# Setting the working directory
WORKDIR /app

# Install pipenv dependencies (Uses some separate precompiled wheels to avoid compiling)
RUN pypy3 -m pip install --prefer-binary --extra-index-url https://pypy.kmtea.eu/simple pycurl==7.43.0 numpy
COPY requirements.txt ./
RUN pypy3 -m pip install -r requirements.txt

# Copy our AWS credentials and construct an entrypoint script to source them
COPY credentials ./	
RUN printf '#!/bin/sh\n. ./credentials\nexec "$@"' > entrypoint.sh
RUN chmod +x entrypoint.sh

# Copying our application into the container
COPY app /app

# Build the frontend with yarn
RUN /bin/bash -c "source ~/.bashrc && cd frontend && yarn install && yarn build"

# Running our application + entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--preload"]