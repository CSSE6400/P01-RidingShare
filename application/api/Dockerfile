FROM pypy:3.10-slim

# Installing dependencies for running a python application
RUN apt-get update && apt-get install -y python3 python3-pip postgresql-client libpq-dev wget

# Setting the working directory
WORKDIR /app

# Install pipenv dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copying our application into the container
COPY app /app

# Running our application
CMD ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--preload"]
