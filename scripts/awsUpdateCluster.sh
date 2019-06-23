#!/bin/sh

aws ecs update-service --force-new-deployment --cluster circles-api-ecs-cluster --service ganache-ecs-service
aws ecs update-service --force-new-deployment --cluster circles-api-ecs-cluster --service circles-api-ecs-service

122abb1c-864f-4070-be71-a91b732863cf  ganache:11
dab0c901-7fae-4c99-9f93-5e3d60ced171  circles_api:47


 0xCAb302A750685cEc2dFaf0040366fD6A67FB5c34