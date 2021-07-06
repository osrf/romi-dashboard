
# First, we need to build the docker image, this will copy all the migrations to the container.

docker build . -t rmf-web/reporting-server-migration-test -f migration-test.dockerfile

if [ ! "$(docker ps -q -f name=reporting-server-migration-test)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=reporting-server-migration-test)" ]; then
        # cleanup
        docker rm reporting-server-migration-test
    fi
    # run your container
    echo "running the container"
    docker run -d --name reporting-server-migration-test rmf-web/reporting-server-migration-test:latest
fi

sleep 5

if [ "$(docker ps -q -f name=reporting-server-migration-test)" ]; then
  echo "running migrations"
  docker exec -it reporting-server-migration-test ./migrate.sh
fi

echo "stopping reporting-server-migration-test"
docker stop reporting-server-migration-test
docker rm reporting-server-migration-test
