# 使用 OpenAI 翻译字幕 :speech_balloon: :globe_with_meridians:

![whisper_preview](pictures/whisper_preview.png)
![preview](pictures/preview.png)
![preview-translated](pictures/preview2.png)

[当前开发任务](https://hqwuzhaoyi.notion.site/gpt-subtitle-b1eed463063a484f93bdfca91277fc3a?pvs=4) :clipboard:

本项目使用 [OpenAI](https://openai.com/) 的 [GPT-3 语言模型](https://openai.com/gpt-3/) :brain: 实现了字幕的线上翻译功能，会把字幕转换成对话进行翻译，支持多种语言翻译，可以方便地将字幕翻译成其它语言的字幕。 :artificial_satellite:

## 新功能 :sparkles:

接入 [whisper.cpp](https://github.com/ggerganov/whisper.cpp) 模型，现在可以:

- 扫描文件夹中的视频和音频 :mag: :film_strip: :headphones:
- 自动翻译字幕 :speech_balloon: :globe_with_meridians:
- 生成新的字幕文件 :page_with_curl:

## 运行环境

本项目使用 Node.js 平台运行，需要先在本地安装 Node.js 环境。在安装 Node.js 环境后，你需要打开命令行工具，进入项目根目录，且安装 pnpm,然后安装项目所需的依赖：

```sh
pnpm install
```

## 使用方法

### 1. 设置 API KEY

在使用翻译功能之前，你需要先在 [OpenAI 官网](https://beta.openai.com/signup/) 注册账户，然后申请 API KEY。在获得 API KEY 后，你可以在根目录下新建一个名为 `.env` 的文件，并在其中添加如下配置：

```sh
OPENAI_API_KEY= // OpenAI API KEY
GOOGLE_TRANSLATE_API_KEY= // Google 翻译 API KEY
BASE_URL= // OpenAI API URL
WEB_PORT=3000 // 前端端口
SERVER_PORT=3001 // 后端端口
NEXT_PUBLIC_SERVER_PORT=3001 // 后端端口
STATIC_PATH=/static // 默认静态资源路径
LANGUAGE=Chinese // 默认翻译语言
OUTPUT_SRT_THEN_TRANSLATE=true // 音频转自幕后是否需要翻译
```

将 `your_api_key` 替换成你申请到的 API KEY。

### 2. 运行翻译任务

### 启动 web 界面

```sh
npm run dev
```
