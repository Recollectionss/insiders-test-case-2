> ⚠️ **Warning**  
> This repository contains two shell scripts: `generate_keys.sh` and `int_db.sh`.  
> Please review their contents before executing, as they can modify your system environment or database.


## Project setup

### Set configuration variables
First you need copy all from example.env to .env
```bash
$ cp example.env .env
```

### Run
```bash
$ generate_keys.sh
```
### Or

```bash
$ mkdir -p ./src/shared/keys

$ openssl genpkey -algorithm RSA -out ./src/shared/keys/private.pem -pkeyopt rsa_keygen_bits:2048

$ openssl rsa -pubout -in ./src/shared/keys/private.pem -out ./src/shared/keys/public.pem
```
Start docker
```bash
$ docker compose up
```


### API
```url
http://localhost:5010/api/#/
```

### Users
- User
  - username: user1
  - password: userpassword
- Admin
  - username: admin
  - password: adminpassword