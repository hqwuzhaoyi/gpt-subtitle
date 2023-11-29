# GPT-Subtitle :speech_balloon: :globe_with_meridians:

<div align="center">

[![Build & Test](https://github.com/hqwuzhaoyi/gpt-subtitle/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/hqwuzhaoyi/gpt-subtitle/actions/workflows/build.yml) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhqwuzhaoyi%2Fgpt-subtitle.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhqwuzhaoyi%2Fgpt-subtitle?ref=badge_shield&issueType=license)

</div>

English | [简体中文](./README-zh_CN.md)

![whisper_preview](pictures/whisper_preview.png)

[View Current Development Task](https://hqwuzhaoyi.notion.site/gpt-subtitle-b1eed463063a484f93bdfca91277fc3a?pvs=4) :clipboard:

GPT-Subtitle combines [Whisper](https://github.com/ggerganov/whisper.cpp) and [OpenAI](https://openai.com/)’s [GPT-3 Language Model](https://openai.com/gpt-3/) :brain:, offering you local translation functionality for audio and video. It not only translates subtitles into dialogues but also supports multiple language translations and allows you to conveniently translate subtitles into other languages. :artificial_satellite:

## :sparkles: Key Features:

By integrating the [whisper.cpp](https://github.com/ggerganov/whisper.cpp) model, you can now:

- Scan videos and audios in a folder and convert them into srt subtitle files :mag: :film_strip: :headphones:
- Utilize optimization algorithms to translate multi-language subtitle files :speech_balloon: :globe_with_meridians:

## :wrench: Tech Stack

- NextJS 13 (App Router)
- NestJS
- Jotai
- Framer Motion
- Radix UI
- Socket.IO
- TailwindCSS

## Running Environment

This project runs on the Node.js platform, so you need to install Node.js on your local machine first. After installation, open your command-line tool, navigate to the project root directory, and install pnpm and the necessary dependencies:

```sh
pnpm install

```

Install whisper

```sh
sh setup-whisper.sh
```

Install ffmpeg, please install it yourself for other systems

```sh
brew install ffmpeg
```

Also need to install redis and mysql, please install other systems by yourself

```sh
brew install redis
brew install mysql
```

## Usage

### Setting up API KEY

Before using the translation feature, you need to register an account on the [OpenAI official website](https://beta.openai.com/signup/) and apply for an API KEY. After obtaining the API KEY, you can copy a `.env` file from `.env.template` in the root directory and add the following configuration:

```sh
OPEN_AUTH=true            # Whether to enable authentication
OPENAI_API_KEY=           # OpenAI API KEY
GOOGLE_TRANSLATE_API_KEY= # Google API KEY(Can be left blank)
BASE_URL=                 # OpenAI API URL

# Database Setting
REDIS_PORT=6379             # Redis port
REDIS_HOST=subtitle_redis   # Redis address
MYSQL_HOST=subtitle_mysql   # MySQL address
MYSQL_PORT=3306             # MySQL port
MYSQL_USER=root             # MySQL user
MYSQL_PASSWORD=123456       # MySQL passowrd
MYSQL_DATABASE=gpt_subtitle # MySQL Database name

# Server Address Setting
NEXT_PUBLIC_API_URL=http://localhost:3001 # Same as above. Backend API address
WEB_PORT=3000                             # Front-end start port
SERVER_PORT=3001                          # Backend start port

# GitHub Auth Setting
GITHUB_CLIENT_ID=           # GitHub client ID
GITHUB_CLIENT_SECRET=       # GitHub client secret
AUTH_SECRET = YOUR_KEY_HERE # JWT secret you can run `openssl rand -base64 32` to generate a secret

# System Setting
# You can edit in Setting
OUTPUT_SRT_THEN_TRANSLATE=true # Whether to output the SRT file first and then translate it
TranslateModel=google          # google or gpt3
LANGUAGE=zh-CN                 # Output SRT file and then translate the language
TRANSLATE_DELAY=1500 # Delay between calling translation interface
TRANSLATE_GROUP=4    # Translate sentences for grouping translation, how many sentences can be translated at most at a time
```

Replace `your_api_key` with your own API key.

### Running the Program

### Deploy the service locally:

```sh
npm run deploy:prod
```

## :whale: Docker Deployment

### :books: Using docker-compose

1. Change the arguments inside `docker-compose.yml`

   ```text
   args:
        - WEB_PORT=3000
        - SERVER_PORT=3001
        - NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

2. Run the command

   ```bash
   docker-compose up -d
   ```

## setup-whisper

`setup-whisper.sh`, install whisper script

You can choose the downloaded model by uncommenting before `make`

```sh
# more info about whisper.cpp: https://github.com/ggerganov/whisper.cpp
# make tiny.en
# make tiny
# make base.en
# make base
# make small.en
# make small
# make medium.en
# make medium
# make large-v1
# make large
```

The larger the model, the better the translation effect, but the slower it is. It is recommended to use the large model for languages other than English.

Nvidia GPU can accelerate the operation of models, but CUDA needs to be installed. For details, see [whisper](https://github.com/ggerganov/whisper.cpp) project instructions.
