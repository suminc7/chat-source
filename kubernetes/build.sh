#!/usr/bin/env bash

CLOUDSDK_COMPUTE_ZONE=us-central1-a
CLOUDSDK_CONTAINER_CLUSTER=chat


#kubectl apply -f websocket/

gcloud compute disks create --size=200GB --zone=${CLOUDSDK_COMPUTE_ZONE} mongo-disk

gcloud container clusters create chat --num-nodes=3 --machine-type=f1-micro --zone ${CLOUDSDK_COMPUTE_ZONE}

kubectl apply -f mongo/
kubectl apply -f redis/
kubectl apply -f websocket/