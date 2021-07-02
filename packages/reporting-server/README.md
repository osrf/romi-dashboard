# Description

This project is about a server that exposes two APIs, one for writing logs to a persistent storage and the other for generating reports. As the project's name says, the idea is to work as a reporting server. The reporting server is designed to receive data through [Fluentd](https://www.fluentd.org/) (a data collection tool) from different pods within a Kubernetes cluster. Log data is transformed via a parser from the format that Fluentd uses for storage in the server. You can find the log formats [here](https://github.com/open-rmf/rmf-web/blob/main/packages/reporting-server/rest_server/__mocks__/raw_data.py).

In the following image, we can observe how all the pods interact with the reporting server
![rmf-web kubernetes cluster diagram](https://user-images.githubusercontent.com/28668944/123916706-8b56e300-d9b4-11eb-990f-69e717f87b38.png)


# Setup

Install pipenv

```bash
pip3 install pipenv
```

If not already done so, [bootstrap](../../README.md#bootstrap) the project, you can use

```bash
lerna bootstrap --scope=reporting-server
```

to bootstrap only this package.

# Run the server

```bash
reporting_server
```

When you run this command, two instances of the reporting server will run. One on port 8002 where the endpoints will be enabled to ask for reports and 8003 where the endpoints will be enabled to send logs to the reporting server.

![image](https://user-images.githubusercontent.com/11761240/123881439-b12bab80-d912-11eb-987a-77591add6c5d.png)

For development we recommend running this command:

```bash
npm run start:dev
```

This would only create one instance of the reporting-server and it'll serve on the default port. Before the server start it'll check for unapplied migrations and it'll ask you for running those migrations.

## Configuration

Config files are python modules that export a variable named `config`. See [default_config.py](rest_server/default_config.py) for an example and list of the options available. All options are REQUIRED unless specified otherwise.

Configuration is read from the file specified in the env `RMF_REPORT_REST_SERVER_CONFIG`, if not provided, the default config is used.

e.g.
```bash
RMF_REPORT_REST_SERVER_CONFIG='my_config.py' reporting_server
```


## Supported databases

`reporting-server` uses [tortoise-orm](https://github.com/tortoise/tortoise-orm/) to perform database operations. Currently, the supported databases are

* PostgreSQL
* SQLite
* MySQL
* MariaDB

by default it uses a PostgreSQL instance, to use other databases, install reporting-server with the relevant extras

* PostgreSQL - postgres
* MySQL - mysql
* MariaDB - maria

.e.g.

```bash
pip3 install reporting-server[postgres]
```

Create the database instance on the engine that you chose. Then in your config, set the `db_url` accordingly, the url should be in the form

```
DB_TYPE://USERNAME:PASSWORD@HOST:PORT/DB_NAME?PARAM1=value&PARAM2=value
```

for example, to connect to postgres

```
postgres://<user>:<password>@<host>/<database>
```

for more information, see https://tortoise-orm.readthedocs.io/en/latest/databases.html.


## Install PostgreSQL (Optional step if you use a different database)

Instructions for ubuntu 20.04:

Open a terminal and run:

```bash
sudo apt update && sudo apt install postgresql postgresql-contrib
```

Once PostgreSQL is installed, you can run the following command to create a database:

``` bash
sudo -u postgres createdb <database>
# E.g: sudo -u postgres createdb reporting
```

For more information you can check [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)


## Run the application

Now that you have already elected, configured and created a database and set you configurations. You need to run the migrations to create the database tables. We can proceed to apply migrations to create the database tables by running

```bash
aerich upgrade
```

After running this command your database should have all the tables defined in the code. Now you can run the application

```bash
reporting_server
```

If you want to run the migrations and start the server you could also run:

```bash
npm run start:dev
```

# Developers
## Migration
We are using [aerich](https://github.com/tortoise/aerich) as our database migration tool. That means that the changes to made to the model will not be reflected in the database automatically. You must run the aerich migration command to create a new migration with the changes:

``` bash
npm run migrate
```

If there are some changes in the Tortoise models, the previous command will create a migration (sql) file that has your changes. To apply these changes to the database you need to run

``` bash
npm run apply:migrations 
```

![aerich](https://user-images.githubusercontent.com/11761240/122826198-d97f2e80-d2b0-11eb-813f-384f4ae61d6b.png)

## PR migration rules

It should only be one migration file per PR unless is strictly necessary to have multiple migrations for clarity.

## Running tests

### Running unit tests

```bash
npm run test
```

### Running migration tests locally

First, you need to build the docker image, this will copy all the migrations to the container.

```bash
docker build . -t rmf-web/reporting-server-migration-test -f migration-test.dockerfile
```

Once you have your docker image built, you can run it with the following command

```bash
docker run -d --name=reporting-server-migration-test rmf-web/
reporting-server-migration-test:latest
```

Now you have a container with all the migrations and a PostgreSQL database up and running inside the container. To test the migrations you can run the following command:

```bash
docker exec -it reporting-server-migration-test ./migrate.sh
```

Once you're done testing you can stop the container by running the following command:

```bash
docker stop reporting-server-migration-test
```

### Collecting code coverage

```bash
npm run test:cov
```

Generate coverage report
```bash
npm run test:report
```

## Live reload

```bash
uvicorn --reload rest_server.app:get_app
```

## QA

*  I have a zombie process running either on port 8002 or 8003?

   The `reporting_server` runs two instances of the app on the same process. So, sometimes when you shut down one of the reporting-server instances, the other stay alive, resulting in a zombie process. You can kill it by running this command `kill -9 <process id>` (on Linux based OS). That's why we recommend using `npm run start:dev` for development purposes.
