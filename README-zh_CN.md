# GPT-Subtitle :speech_balloon: :globe_with_meridians:

[English](./README.md) | 简体中文

![whisper_preview](pictures/whisper_preview.png)

[查看当前开发任务](https://hqwuzhaoyi.notion.site/gpt-subtitle-b1eed463063a484f93bdfca91277fc3a?pvs=4) :clipboard:

GPT-Subtitle 结合了 [Whisper](https://github.com/ggerganov/whisper.cpp) 和 [OpenAI](https://openai.com/) 的 [GPT-3 语言模型](https://openai.com/gpt-3/) :brain:，为你提供音频和视频的本地翻译功能。不仅能够将字幕转换成对话并进行翻译，而且支持多种语言的翻译，并能方便地将字幕翻译成其他语言。 :artificial_satellite:

## :sparkles: 主要特性:

通过接入 [whisper.cpp](https://github.com/ggerganov/whisper.cpp) 模型，现在你可以:

- 扫描文件夹内的视频和音频，并转换成srt字幕文件 :mag: :film_strip: :headphones:
- 利用优化算法进行多语言字幕文件的翻译 :speech_balloon: :globe_with_meridians:

## :wrench: 技术栈

- NextJS 13 (App Router)
- NestJS
- Jotai
- Framer Motion
- Radix UI
- Socket.IO
- TailwindCSS

## 运行环境

本项目基于 Node.js 平台，因此需要在本地首先安装 Node.js。安装完成后，请打开命令行工具，进入项目根目录，然后安装 pnpm 和项目所需的依赖：

```sh
pnpm install
sh setup-whisper.sh
```



## 使用方法

### 设置 API KEY

在使用翻译功能之前，你需要先在 [OpenAI 官网](https://beta.openai.com/signup/) 注册账户，然后申请 API KEY。在获得 API KEY 后，可以在根目录下从`.env.template`拷贝一个名为 `.env` 的文件，并在其中添加如下配置：

```sh
OPENAI_API_KEY= // OpenAI API KEY
GOOGLE_TRANSLATE_API_KEY= // Google 翻译 API KEY 可以不填
BASE_URL= // OpenAI API URL
WEB_PORT=3000 // 前端端口
SERVER_PORT=3001  // 后端端口

STATIC_PATH=/static // 静态文件路径
OUTPUT_SRT_THEN_TRANSLATE=true // 是否先输出 SRT 文件再翻译
LANGUAGE=zh-CN // 输出 SRT 文件再翻译语言
TRANSLATE_DELAY=1500 // 调用翻译接口间的延迟
TRANSLATE_GROUP=4 // 翻译句子进行分组翻译，一次最多翻译多少句
TranslateModel=google # google or gpt3


REDIS_PORT=6379 // Redis 端口
REDIS_HOST=localhost // Redis 地址
MYSQL_HOST=localhost // MySQL 地址
MYSQL_PORT=3306 // MySQL 端口
MYSQL_USER=root // MySQL 用户名
MYSQL_PASSWORD=123456 // MySQL 密码
MYSQL_DATABASE=gpt_subtitle // MySQL 数据库名

API_URL=http://localhost:3001 // 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001 // 同上， 后端 API 地址
```

### 运行程序

本地部署服务

```sh
npm run deploy:prod
```



## :whale: Docker 部署

### :books: docker-compose

1. change the args inside `docker-compose.yml`

2. run command

```bash
docker-compose up -d
```
