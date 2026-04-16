#!/bin/bash

# Configuration
USERNAME="healthcare" # Change this if you want to push to Docker Hub
DOCKER_HUB_ID=""      # Set your Docker Hub ID if pushing (e.g. "ravindus")

# Color setup
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting MediCare Kubernetes Deployment...${NC}"

# Check if we should use local minikube docker-env
if command -v minikube &> /dev/null && [ "$(minikube status | grep -c 'Running')" -ge 1 ]; then
    echo -e "${GREEN}Minikube detected. Connecting to Minikube's Docker daemon...${NC}"
    eval $(minikube docker-env)
fi

# Services list
SERVICES=("auth-service" "doctor-service" "appointment-service" "patient-service" "payment-service" "ai-symptom-service" "notification-service" "telemedicine-service")

# 1. Build Services
for service in "${SERVICES[@]}"; do
    echo -e "${GREEN}Building $service...${NC}"
    docker build -t $USERNAME/$service:latest ./services/$service
    
    if [ ! -z "$DOCKER_HUB_ID" ]; then
        echo -e "${GREEN}Tagging and pushing $service to Docker Hub...${NC}"
        docker tag $USERNAME/$service:latest $DOCKER_HUB_ID/$service:latest
        docker push $DOCKER_HUB_ID/$service:latest
    fi
done

# 2. Build Frontend
echo -e "${GREEN}Building frontend...${NC}"
docker build -t $USERNAME/frontend:latest ./frontend
if [ ! -z "$DOCKER_HUB_ID" ]; then
    docker tag $USERNAME/frontend:latest $DOCKER_HUB_ID/frontend:latest
    docker push $DOCKER_HUB_ID/frontend:latest
fi

# 3. Apply Configs and Secrets
echo -e "${GREEN}Applying Kubernetes Configurations...${NC}"
kubectl apply -f kubernetes/platform-config.yaml
kubectl apply -f kubernetes/healthcare-secrets.yaml

# 4. Apply Service Manifests
echo -e "${GREEN}Deploying Services to Kubernetes...${NC}"
kubectl apply -f kubernetes/

echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "Use 'kubectl get pods' to check status."
