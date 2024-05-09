FROM pypy:3.9-slim

# Installing dependencies for running a python application
RUN apt-get update && apt-get install -y libpq-dev postgresql-common gcc libgeos++-dev libgeos-3.9.0 libgeos-c1v5 libgeos-dev libgeos-doc

# Setting the working directory
WORKDIR /app

RUN pypy3 -m pip install --extra-index-url https://antocuni.github.io/pypy-wheels/manylinux2010 numpy

# Install pipenv dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copying our application into the container
COPY app /app

# Running our application
CMD ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--preload"]