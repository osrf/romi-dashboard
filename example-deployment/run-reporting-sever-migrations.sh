#!/bin/bash

# Checks if the reporting-server and the reporting-server-db are ready
while [ "$(kubectl get pods -l=app='reporting-server' -o jsonpath='{.items[*].status.containerStatuses[0].ready}')" != "true true" ]; do
   sleep 5
   echo "Waiting for the reporting-server to be ready."
done

# run migration job
echo 'running reporting-server-migrations-job...'
.bin/minikube kubectl -- apply -f k8s/jobs/reporting-server-migrations-job.yaml

# if the migration is finished kill the job
until kubectl get jobs reporting-server-migrations-job -o jsonpath='{.status.conditions[?(@.type=="Complete")].status}' | grep True ;
do 
  echo "wait for migration job to finish"
  sleep 1; 
done

echo 'killing reporting-server-migrations-job...'
.bin/minikube kubectl  -- delete -f k8s/reporting-server-migrations-job.yaml
