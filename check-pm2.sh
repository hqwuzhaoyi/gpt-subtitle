#!/bin/bash

# 检查 pm2 是否安装
if ! command -v pm2 &> /dev/null; then
  # 如果未安装 pm2，则安装
  echo "pm2 未安装，正在安装..."
  npm install -g pm2
fi

# 运行传递给脚本的其余参数（例如 npm run build 和 pm2 命令）
"$@"
