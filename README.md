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

Replace `your_api_key` with your own API key.

### Running the Program

### Deploy the service locally:

```sh
npm run deploy:prod
```

## :whale: Docker Deployment

This guide will lead you through two ways to deploy the GPT Subtitle app with Docker: directly using pre-built Docker images to start services or by building custom images to start services. Here are the specific steps and related configurations.

### :arrow_forward: Direct Start (Using docker-compose.yml)

You can directly use the docker-compose.yml file to start and run your services.

1. Edit Environment Variables

   Ensure the .env file contains all necessary environment variables, such as database credentials, etc.

2. Start Services

   Execute the following command to start all services:

   ```sh
   docker-compose up -d
   ```

   This will start the services in the background based on the configuration in the docker-compose.yml file.

### :gear: Build and Start (Using docker-compose-build.yml)

If you need to build images according to your own needs, or want to deploy the application from the source code, you can use the docker-compose-build.yml file.

1. Configure Build Arguments

   In the docker-compose-build.yml file, configure the build arguments and environment variables for the services that need to be built. For example, for the frontend service subtitle_web, you can configure the build arguments as follows:

   ```yml
   services:
     subtitle_web:
       build:
         args:
           - WEB_PORT=3000
           - SERVER_PORT=3001
           - NEXT_PUBLIC_API_URL=http://localhost:3001

   ```

2. Build and Start Services

   Use the following command to build the images and start the services:

   ```sh
   docker-compose -f docker-compose-build.yml up -d

   ```

   Note that the -f parameter is specified to use the docker-compose-build.yml file.

### :stop_sign: Stop Services

Regardless of which method is used to start the services, you can execute the following command when you need to stop and clean up the services:

```sh
docker-compose -f <corresponding file name> down
```

## :memo: Considerations

- Ensure all environment variables are correctly configured in the `.env` file.
- If you need to modify the service's port mappings or volume paths, ensure these modifications are reflected in the respective `docker-compose.yml` or `docker-compose-build.yml` file.
- When using the `docker-compose-build.yml` file, you may need to adjust the `context` and `dockerfile` paths according to the actual paths.

This way, you can flexibly deploy the GPT Subtitle app by choosing to directly start the services or build the images based on your specific needs.

## setup-whisper

The larger the model, the better the translation effect, but the slower it is. It is recommended to use the large model for languages other than English.

Nvidia GPU can accelerate the operation of models, but CUDA needs to be installed. For details, see [whisper](https://github.com/ggerganov/whisper.cpp) project instructions.
