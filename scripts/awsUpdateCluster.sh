#!/bin/sh
#https://docs.aws.amazon.com/cli/latest/reference/ecs/update-service.html

aws ecs update-service --force-new-deployment --cluster circles-api-ecs-cluster --service ganache-ecs-service
aws ecs update-service --force-new-deployment --cluster circles-api-ecs-cluster --service circles-api-ecs-service