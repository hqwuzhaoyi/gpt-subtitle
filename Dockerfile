# 使用官方 Node.js 镜像作为基础镜像
FROM node:alpine

# 设置工作目录
WORKDIR /app

# 安装 git
RUN apk add --no-cache git ffmpeg

# 安装 PM2
RUN npm install pm2 -g
RUN npm install pnpm -g

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN pnpm install

# 复制其他源代码文件到工作目录
COPY . .

# 构建并启动应用
RUN npm run deploy:prod

# 暴露的端口
EXPOSE 3000

# 复制 start.sh 并使其可执行
COPY start.sh /start.sh
RUN chmod +x /start.sh

# 使用 start.sh 脚本运行应用
CMD ["/start.sh"]