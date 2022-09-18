docker build -t billing-app .

kubectl get deployment


kubectl config use-context docker-desktop


docker run -d -p 5000:5000 --restart=always --name registry registry:2


docker tag my-react-app localhost:5000/my-react-app

docker push localhost:5000/billing-app

kubectl apply -f deployment.yaml

kubectl get pods