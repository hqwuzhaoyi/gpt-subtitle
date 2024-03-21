WEB_IMAGE_NAME="hqwuzhaoyi/gpt-subtitle-web:latest" # 你可以替换为实际的名称
API_IMAGE_NAME="hqwuzhaoyi/gpt-subtitle-api:latest" # 你可以替换为实际的名称

docker build -t $WEB_IMAGE_NAME \
    -f ./apps/web/Dockerfile --load .
docker build -t $API_IMAGE_NAME \
    -f ./apps/server/Dockerfile --load .
