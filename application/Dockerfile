FROM pypy:3.9-slim

# Installing dependencies for running a python application
RUN apt-get update && apt-get install -y libpq-dev postgresql-common gcc libgeos++-dev libgeos-3.9.0 libgeos-c1v5 libgeos-dev libgeos-doc
RUN apt-get install -y openssl libcurl4-nss-dev libssl-dev

# Setting the working directory
WORKDIR /app

# Install pipenv dependencies (numpy is done separately using a wheel to avoid compiling)
RUN pypy3 -m pip install --prefer-binary --extra-index-url https://pypy.kmtea.eu/simple pycurl==7.43.0 numpy
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy our AWS credentials and consturct an entrypoint script for them
COPY credentials ./
RUN printf '#!/bin/sh\n. ./credentials\nexec "$@"' > entrypoint.sh
RUN chmod +x entrypoint.sh

# Copying our application into the container
COPY app /app

# Running our application + entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
CMD ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--preload"]