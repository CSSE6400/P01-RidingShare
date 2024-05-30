# P01-RidingShare

# Deploying the Application

## Installing the Environment
To deploy the application both Terraform and the AWS cli tools must be installed.  

Some installation scripts have been provided to streamline the process for specific OSes.

The following script installs the Terraform cli tool using the apt package manager. If you use something other than apt, follow the installation guide link.
```shell
./install_terraform.sh
```

The following script installs the AWS cli tool. It supports both Linux and MacOS installation.
```shell
./install_aws.sh
```

The links for installation documentation can be found below.   
- [Terraform Installer](https://developer.hashicorp.com/terraform/install)    
- [AWS cli Installer](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)


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