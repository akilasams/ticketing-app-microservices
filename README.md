# Ho to Run

#### Setting K8 Secrets

```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
```

#### Getting K8 Secrets

```shell
kubectl get secrets
```
