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

## Google Drive Link:
Including Meeting Nodes: **https://drive.google.com/drive/folders/1KTdEoMaBiBy9DyV_FiBjfzwiMvqolhYX?usp=drive_link**
