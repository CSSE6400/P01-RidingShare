# P01-RidingShare

## Current Scripts Available

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
