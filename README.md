# Development Setup Guide

## Install Minikube & Run

- Follow the instructions in the [video](https://www.youtube.com/watch?v=xNefZ51jHKg)
- After successful installation, run docker and execute the below command to start minikube service

```shell
minikube start
```

- For more info visit [docs](https://minikube.sigs.k8s.io/docs/)

## Change Host File Content & Tunnel

- Host file location in Windows : C:\Windows\System32\drivers\etc\hosts
- Add this line to the bottom of the file to redirect all requests sent to ticketing.dev to localhost : `127.0.0.1 ticketing.dev`
- Run the below command to redirect sent to cluster ip of the minikube container to

## Creating K8 Secrets

- Setting K8 Secrets

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

- Getting K8 Secrets

```shell
kubectl get secrets
```
