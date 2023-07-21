#!/bin/bash

# 设置 Docker CLI 为 experimental mode
export DOCKER_CLI_EXPERIMENTAL=enabled

# 创建并使用一个新的 builder instance
docker buildx create --use

# 为 api 服务构建镜像并推送到 Docker registry
API_IMAGE_NAME="hqwuzhaoyi/gpt-subtitle-web:latest"  # 你可以替换为实际的名称
docker buildx build --platform linux/amd64,linux/arm64 -t $API_IMAGE_NAME -f ./apps/server/Dockerfile --push .

# 为 web 服务构建镜像并推送到 Docker registry
WEB_IMAGE_NAME="hqwuzhaoyi/gpt-subtitle-api:latest"  # 你可以替换为实际的名称
docker buildx build --platform linux/amd64,linux/arm64 -t $WEB_IMAGE_NAME -f ./apps/web/Dockerfile --push .

echo "构建完成！"
