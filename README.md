# Ho to Run

## Install Minikube

- Follow the instructions in the [video](https://www.youtube.com/watch?v=xNefZ51jHKg)

## Change host file content

- Host file location in Windows : C:\Windows\System32\drivers\etc\hosts
- Add the below lines to the bottom of the file
  `127.0.0.1 ticketing.dev`

## Creating K8 Secrets

- Setting K8 Secrets

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

- Getting K8 Secrets

```shell
kubectl get secrets
```
