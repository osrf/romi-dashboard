
DOCKER_CONTAINER_NAME="reporting-server-migration-test"
# First, we need to build the docker image, this will copy all the migrations to the container.

docker build . -t rmf-web/reporting-server-migration-test -f migration-test.dockerfile

if [ ! "$(docker ps -q -f name=$DOCKER_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=$DOCKER_CONTAINER_NAME)" ]; then
        # cleanup
        docker rm reporting-server-migration-test
    fi
    echo "running the container"
    docker run -d --name $DOCKER_CONTAINER_NAME rmf-web/reporting-server-migration-test:latest
fi


if [ "$(docker ps -q -f name=$DOCKER_CONTAINER_NAME)" ]; then
  
  echo "waiting for postgres to be up and runnning"
  timeout 10s bash -c "until docker exec $DOCKER_CONTAINER_NAME pg_isready ; do sleep 5 ; done"
  
  echo "running migrations"
  docker exec -it $DOCKER_CONTAINER_NAME ./migrate.sh
fi

echo "stopping"
docker stop $DOCKER_CONTAINER_NAME

echo "removing"
docker rm $DOCKER_CONTAINER_NAME
