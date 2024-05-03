FROM pypy:3.10-slim

# Installing dependencies for running a python application
RUN apt-get update && apt-get install -y wget libpq-dev postgresql-common

# Setting the working directory
WORKDIR /app

# Install pipenv dependencies
COPY requirements.txt ./
RUN pypy -m pip install -r requirements.txt

# Copying our application into the container
COPY app /app

# Running our application
CMD ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--preload"]
