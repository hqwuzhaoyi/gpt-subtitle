#!/bin/bash

# 设置 Docker CLI 为 experimental mode
# export DOCKER_CLI_EXPERIMENTAL=enabled

# docker build -t gpt-subtitle-web -f ./apps/web/Dockerfile --build-arg NEXT_PUBLIC_API_URL=http://192.168.2.23:3001 .

# docker build -t gpt-subtitle-api -f ./apps/server/Dockerfile .

# 为 api 服务构建镜像并推送到 Docker registry
API_IMAGE_NAME="hqwuzhaoyi/gpt-subtitle-web:latest" # 你可以替换为实际的名称

docker buildx build --platform linux/amd64,linux/arm64 -t $API_IMAGE_NAME -f ./apps/web/Dockerfile --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 --push .

# 为 web 服务构建镜像并推送到 Docker registry
WEB_IMAGE_NAME="hqwuzhaoyi/gpt-subtitle-api:latest" # 你可以替换为实际的名称
docker buildx build --platform linux/amd64,linux/arm64 -t $WEB_IMAGE_NAME -f ./apps/server/Dockerfile --push .

echo "构建完成！"
