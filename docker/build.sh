docker build -t gpt-subtitle-server -f Dockerfile --target server .
docker build -t gpt-subtitle-web -f Dockerfile --target web .