# P01-RidingShare

# Application Demo
As the application requires a collection of self-hosted tools and engines to perform, that can take time to be provisioned a simplified demo script has been created that modifies the usage of these enigines to publically available free and open-source hosting. 

Please note however that due to demo constraints and the usage of these externally hosted API's being rate limited the demo application will be slightly limited. he functionality of this demo is not significantly impacted however, so no noticible difference should be felt. With the only major difference being no security certificate will be provisioned and connected instead the demo uses HTTP.

If you would like for the full application to be spun up you can either follow the steps below on [Deploying the Application](#Deploying-the-Application) however this will take time to provision the apis, or contact one of the team members and we can deploy a fully independent API. T

## Setting up the envrionment
To deploy the demo script you will need that `Terraform` and `Docker` both installed on your system.

Below are the links to installation guides for both of these tools. Ensure you follow the correct instructions for your system.
- [Terraform Installer Guide](https://developer.hashicorp.com/terraform/install)    
- [Docker Installer Guide](https://docs.docker.com/engine/install/)

## Creating credentials
Running the demo requires AWS credentials to be passed in. A shell script has been provided to generate a blank credentials file for you to fill out. Simply run the following script command.
```shell
./generate_credentials_file.sh
```
Once the credentials file is generated simply paste in your AWS credentials.   
The credentials file must export your credentials as environment variables such as below.
```shell
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
```

## Running the Demo
After setting up the required environment and credentials you can then just run the demo script .
```shell
./demo.sh
```
After running the script an `application_url.txt` file will be generated with the URL of the demo to run on. Additinally the URL will also be displayed in the console output under `application_dns_name`.

**NOTE**   
Please note that for the demo your application will be generated under a new DNS and such won't have a signed certificate and instead will use HTTP. Additionally the demo application will only last until your temporary credentials expire.


## Stopping the Demo
After finishing with the demo you need to teardown the application so it does not remain running. Once again a script has been provided for convinence. 

**NOTE**   
Please note that depending on how long the application was up for your credentials may have expired and new ones will need to be generated. These new credentials simply need to be copied into the credentials file again as above, replacing the existing ones.

```shell
./teardown.sh
```


# Deploying the Application

## Installing the Environment
To deploy the application both Terraform and the AWS cli tools must be installed. Additionally Docker needs to be installed to create the container image locally.

Some installation scripts have been provided to streamline the process for specific OSes.

The following script installs the Terraform cli tool using the apt package manager. If you use something other than apt, follow the installation guide link.
```shell
./install_terraform.sh
```

The following script installs the AWS cli tool. It supports both Linux and MacOS installation.
```shell
./install_aws.sh
```

The links for installation documentation can be found below. Ensure you follow the correct instructions for your system.
- [Terraform Installer Guide](https://developer.hashicorp.com/terraform/install)    
- [AWS cli Installer Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Docker Installer Guide](https://docs.docker.com/engine/install/)


## Self-Hosted API Tools
This application makes usage of a self-hosted Routing Engine [(OSRM)](https://project-osrm.org/) and Geocoding tool [(Nominatim)](https://nominatim.org/).

This is achieved by running these tools in an AWS EC2 instance that is controlled by the development pipeline.

Further information on this can be found below in the [Self-Hosted Deployment Commands](#Self-Hosted-Deployment-Commands) section.

## Deploying the Application

### Credentials
To deploy the application your AWS credentials must be supplied. Running the `install_aws.sh` script setups up the appropriate environment and creates a blank credentials file.   
The credentials file must export your credentials as environment variables such as below.
```shell
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
```

### Deployment
Once the credentials are properly stored run the deployment script.
```shell
./deploy.sh
```

## Tearing Down the Application
Similarly to the deployment phase, your AWS credentials are required, and there exists a teardown script.   

Simply supply your credentials as per above and the run the following teardown script.
```shell
./teardown.sh
``` 


## Additional Local Scripts Available

### Deploy in local container
The default option to run the application locally is through docker compose. A provided script makes the deployment easy.  
Run the below script from the top directory:
```shell
./local.sh
```
**Note:** The containers run in daemon mode and should be stopped after usage so they don't continue running. For which is a script is provided.

**Note:** The database data will persist between docker composes, but there is a provided script to purge the entire database.

---

### Cleanup Containers
After running the containers they need to be spun down full by the docker daemon.   
Run the below script from the top directory:
```shell
./cleanup.sh
```

---

### Purge the database
Due to the database persisting locally, a script is provided to purge the entire database so it gets created from scratch next time its spun up.   
Run the below script from the top directory:
```shell
./purge_db.sh
```

---

## Self-Hosted Deployment Commands

To recreate the full test suite the self-hosted tools are deployed seperately. This was done as to ensure they remain paritioned even when tearing down the full application, as there is significant performance and time overheads on their initial creation. 

1. Parition an EC2 instance on AWS.
Create a new EC2 instance on AWS cloud, our instance is a `t3.large` with a `60GB` volume.


2. Run the following 5 commands on the new instance.
**Note:** The first command can take a while to parition and transform street data.

```Docker
docker run -it --shm-size=4g \
  -e PBF_URL=https://download.geofabrik.de/australia-oceania/australia-latest.osm.pbf \
  -e REPLICATION_URL=http://download.geofabrik.de/australia-oceania/australia-updates/ \
  -e IMPORT_WIKIPEDIA=false \
  -e NOMINATIM_PASSWORD=very_secure_password \
  -v nominatim-data:/var/lib/postgresql/14/main \
  -p 8080:8080 \
  --name nominatim \
  mediagis/nominatim:4.4

docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/australia-latest.osm.pbf || echo "osrm-extract failed"

docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/australia-latest.osrm || echo "osrm-partition failed"

docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/australia-latest.osrm || echo "osrm-customize failed"

docker run -t -i  --name OSRM -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/australia-latest.osrm
```

3. Add the instance ID to the deployment pipeline.
To link the deployment pipeline to your own EC2 instance simply update the instance ID.
Inside the  `/terraform/hosted_apis.tf` file update the second line to your instance_id, as below.
	```json
	data "aws_instance" "hosted_apis" {
		instance_id = "YOUR_INSTANCE_ID"
	}
	```