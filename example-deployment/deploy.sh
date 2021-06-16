#!/bin/bash
set -e

function kubectl() {
  .bin/minikube kubectl -- "$@"
}

function usage() {
  echo "Usage: deploy.sh --rmf-ws <path> --rmf-web-ws <path>"
}

options=$(getopt -o '' -l rmf-ws:,rmf-web-ws: -- "$@")
eval set -- "$options"
while true; do
  case "$1" in
    --rmf-ws)
      shift
      rmf_ws=$(realpath -s $1)
      ;;
    --rmf-web-ws)
      shift
      rmf_web_ws=$(realpath -s $1)
      ;;
    --)
      shift
      break
      ;;
  esac
  shift
done

if [[ -z $rmf_ws || -z $rmf_web_ws ]]; then
  usage
  exit 1
fi

cd $(dirname $0)

echo 'building base keycloak image...'
docker build -t rmf-web/keycloak -f docker/keycloak/keycloak.dockerfile docker/keycloak/
echo 'publishing keycloak image...'
docker save rmf-web/keycloak | bash -c 'eval $(.bin/minikube docker-env) && docker load'
echo 'deploying keycloak...'

kubectl apply -f k8s/keycloak.yaml
echo 'waiting for keycloak to be ready...'
kubectl wait --for=condition=available deployment/keycloak --timeout=2m

echo 'creating jwt configmap...'
function try() {
  "$@" || (sleep 1 && "$@") || (sleep 5 && "$@")
}
# sometimes keycloak reports that it is ready before it can actually serve requests
try node keycloak-tools/bootstrap-keycloak.js
try node keycloak-tools/get-cert.js > keycloak.pem
openssl x509 -in keycloak.pem -pubkey -noout -out jwt-pub-key.pub
kubectl create configmap jwt-pub-key --from-file=jwt-pub-key.pub -o=yaml --dry-run=client | kubectl apply -f -

echo 'deploying Minio...'
.bin/minikube kubectl -- apply -f k8s/minio.yaml

echo 'building base rmf image...'
docker build -t rmf-web/builder -f docker/builder.dockerfile $rmf_ws/src

echo 'building rmf-server image...'
docker build -t rmf-web/rmf-server -f docker/rmf-server.dockerfile $rmf_web_ws
echo 'publishing rmf-server image...'
docker save rmf-web/rmf-server | bash -c 'eval $(.bin/minikube docker-env) && docker load'
echo 'creating rmf-server configmap...'
kubectl create configmap rmf-server-config --from-file=rmf_server_config.py -o=yaml --dry-run=client | kubectl apply -f -
echo 'deploying rmf-server...'
kubectl apply -f k8s/rmf-server.yaml

echo 'building dashboard image...'
docker build -t rmf-web/dashboard -f docker/dashboard.dockerfile $rmf_web_ws
echo 'publishing dashboard image...'
docker save rmf-web/dashboard | bash -c 'eval $(.bin/minikube docker-env) && docker load'
echo 'deploying dashboard...'
kubectl apply -f k8s/dashboard.yaml

echo 'building reporting-server image...'
docker build -t rmf-web/reporting-server -f docker/reporting-server.dockerfile $rmf_web_ws
echo 'publishing reporting-server image...'
docker save rmf-web/reporting-server | bash -c 'eval $(.bin/minikube docker-env) && docker load'
echo 'creating reporting-server configmap...'
kubectl create configmap reporting-server-config --from-file=reporting_server_config.py -o=yaml --dry-run=client | kubectl apply -f -
echo 'deploying reporting-server...'
kubectl apply -f k8s/reporting-server.yaml


echo 'building reporting image...'
docker build -t rmf-web/reporting -f docker/reporting.dockerfile $rmf_web_ws
echo 'publishing reporting image...'
docker save rmf-web/reporting | bash -c 'eval $(.bin/minikube docker-env) && docker load'
echo 'deploying reporting-server...'
kubectl apply -f k8s/reporting.yaml


# Checks if the reporting-server and the reporting-server-db are ready
while [ "$(kubectl get pods -l=app='reporting-server' -o jsonpath='{.items[*].status.containerStatuses[0].ready}')" != "true true" ]; do
   sleep 5
   echo "Waiting for the reporting-server to be ready."
done

# run migration job
echo 'running migration job...'
.bin/minikube kubectl -- apply -f k8s/jobs.yaml

# if the migration is finished kill the job
until kubectl get jobs reporting-server-migrations-job -o jsonpath='{.status.conditions[?(@.type=="Complete")].status}' | grep True ;
do 
  echo "wait for migration job to finish"
  sleep 1; 
done

echo 'killing migration job...'
.bin/minikube kubectl  -- delete -f k8s/jobs.yaml

echo 'deploying Minio...'
.bin/minikube kubectl -- apply -f k8s/minio.yaml

echo 'Applying FluentD configmap ...'
.bin/minikube kubectl -- apply -f k8s/fluentd-configmap.yaml
echo 'deploying FluentD daemonset...'
.bin/minikube kubectl -- apply -f k8s/fluentd.yaml

echo 'deploying cronjobs ...'
.bin/minikube kubectl -- apply -f k8s/cronjobs.yaml
