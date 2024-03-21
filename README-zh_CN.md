# GPT-Subtitle :speech_balloon: :globe_with_meridians:

<div align="center">

[![Build & Test](https://github.com/hqwuzhaoyi/gpt-subtitle/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/hqwuzhaoyi/gpt-subtitle/actions/workflows/build.yml) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhqwuzhaoyi%2Fgpt-subtitle.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhqwuzhaoyi%2Fgpt-subtitle?ref=badge_shield&issueType=license)

</div>

[English](./README.md) | 简体中文

![whisper_preview](pictures/whisper_preview.png)

[查看当前开发任务](https://hqwuzhaoyi.notion.site/gpt-subtitle-b1eed463063a484f93bdfca91277fc3a?pvs=4) :clipboard:

GPT-Subtitle 结合了 [Whisper](https://github.com/ggerganov/whisper.cpp) 和 [OpenAI](https://openai.com/) 的 [GPT-3 语言模型](https://openai.com/gpt-3/) :brain:，为你提供音频和视频的本地翻译功能。不仅能够将字幕转换成对话并进行翻译，而且支持多种语言的翻译，并能方便地将字幕翻译成其他语言。 :artificial_satellite:

## :sparkles: 主要特性

通过接入 [whisper.cpp](https://github.com/ggerganov/whisper.cpp) 模型，现在你可以:

- 扫描文件夹内的视频和音频，并转换成 srt 字幕文件 :mag: :film_strip: :headphones:
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

```

安装 ffmpeg,其他系统请自行安装

```sh
brew install ffmpeg
```

也需要安装 redis 和 mysql，其他系统请自行安装

```sh
brew install redis
brew install mysql
```

## 使用方法

### 设置 API KEY

在使用翻译功能之前，你需要先在 [OpenAI 官网](https://beta.openai.com/signup/) 注册账户，然后申请 API KEY。在获得 API KEY 后，可以在根目录下从`.env.template`拷贝一个名为 `.env` 的文件，并在其中添加如下配置：

```sh
# Frontend Setting
NEXT_PUBLIC_API_URL=http://localhost:3001 # Backend API address
WEB_PORT=3000                             # Frontend start port

# Backend Setting
OPENAI_API_KEY=           # OpenAI API KEY
GOOGLE_TRANSLATE_API_KEY= # Google API KEY(Can be left blank)
BASE_URL=                 # OpenAI API URL

## Database Setting
REDIS_PORT=6379             # Redis port
REDIS_HOST=subtitle_redis   # Redis address
MYSQL_HOST=subtitle_mysql   # MySQL address
MYSQL_PORT=3306             # MySQL port
MYSQL_USER=root             # MySQL user
MYSQL_PASSWORD=123456       # MySQL passowrd
MYSQL_DATABASE=gpt_subtitle # MySQL Database name

## Server Address Setting
SERVER_PORT=3001 # Backend start port

## System Setting. You can edit in Setting
OUTPUT_SRT_THEN_TRANSLATE=true # Whether to output the SRT file first and then translate it
TranslateModel=google          # google or gpt3
LANGUAGE=zh-CN                 # Output SRT file and then translate the language
TRANSLATE_DELAY=1500           # Delay between calling translation interface
TRANSLATE_GROUP=4              # Translate sentences for grouping translation, how many sentences can be translated at most at a time

```

### 运行程序

本地部署服务

```sh
npm run deploy:prod
```

## :whale: Docker 部署

本指南将引导您通过两种方式使用 Docker 部署 GPT Subtitle 应用：直接使用预构建的 Docker 镜像启动服务，或通过构建自定义镜像启动服务。以下是具体步骤和相关配置。

### :arrow_forward: 直接启动（使用 docker-compose.yml）

可以直接使用 docker-compose.yml 文件来启动和运行您的服务。

1. 编辑环境变量

   确保 .env 文件中包含所有必要的环境变量，如数据库凭据等。

2. 启动服务

   执行以下命令来启动所有服务：

   ```sh
   docker-compose up -d
   ```

这将基于 docker-compose.yml 文件中的配置，在后台启动服务。

### :gear: 构建并启动（使用 docker-compose-build.yml）

如果您需要根据自己的需求构建镜像，或者想要从源代码开始部署应用，可以使用 docker-compose-build.yml 文件。

1. 配置构建参数

   在 docker-compose-build.yml 文件中，为需要构建的服务配置构建参数和环境变量。例如，对于前端服务 subtitle_web，您可以如下配置构建参数：

   ```yml
   services:
     subtitle_web:
       build:
         args:
           - WEB_PORT=3000
           - SERVER_PORT=3001
           - NEXT_PUBLIC_API_URL=http://localhost:3001

   ```

2. 构建并启动服务

   使用以下命令来构建镜像并启动服务：

   ```sh
   docker-compose -f docker-compose-build.yml up -d

   ```

   请注意，这里指定了 -f 参数来使用 docker-compose-build.yml 文件。

### :stop_sign: 停止服务

不论使用哪种方式启动服务，当需要停止和清理服务时，可以执行：

```sh
docker-compose -f <对应的文件名> down
```

## :memo: 注意事项

- 请确保所有的环境变量都已经在 `.env` 文件中正确配置。
- 如果需要修改服务的端口映射或卷路径，请确保这些修改反映在相应的 `docker-compose.yml` 或 `docker-compose-build.yml` 文件中。
- 使用 `docker-compose-build.yml` 文件时，您可能需要根据实际路径调整 `context` 和 `dockerfile` 的路径。

这样，您就可以根据具体需求选择直接启动服务或通过构建镜像启动服务，灵活部署 GPT Subtitle应用。

## setup-whisper

模型越大，翻译效果越好，但是速度越慢，建议除了英语使用 large 模型

Nvida GPU 可以加速模型的运行，但是需要安装 CUDA，详情见 [whisper](https://github.com/ggerganov/whisper.cpp) 项目的说明
