# 使用 OpenAI 翻译字幕

本项目使用 [OpenAI](https://openai.com/) 的 [GPT-3 语言模型](https://openai.com/gpt-3/) 实现了字幕的线上翻译功能，支持多种语言翻译，可以方便地将英文字幕翻译成其它语言的字幕。

![preview](pictures/preview.png)
![preview-translated](pictures/preview2.png)

## 运行环境

本项目使用 Node.js 平台运行，需要先在本地安装 Node.js 环境。在安装 Node.js 环境后，你需要打开命令行工具，进入项目根目录，且安装 pnpm,然后安装项目所需的依赖：

```sh
pnpm install
```

## 使用方法

### 1. 设置 API KEY

在使用翻译功能之前，你需要先在 [OpenAI 官网](https://beta.openai.com/signup/) 注册账户，然后申请 API KEY。在获得 API KEY 后，你可以在根目录下新建一个名为 `.env` 的文件，并在其中添加如下配置：

```sh
OPENAI_API_KEY=your_api_key
BASE_URL=
```

将 `your_api_key` 替换成你申请到的 API KEY。

### 2. 运行翻译任务

### 启动 web 界面

```sh
npm run dev
```

### 或者使用命令行任务

本项目提供了脚本文件 `translate.ts` 用于执行翻译任务。在命令行中输入以下指令即可开始翻译：

```sh
npx ts-node src/translate.ts -i The.Super.Mario.Bros.Movie.2023.1080p.Cam.X264.Will1869.srt -o output.srt -l Chinese
```

翻译文件夹在 `test_subtitles`

其中 `input.srt` 是输入的英文字幕文件名，`Chinese` 是输出的翻译目标语言。用户可自行根据需要修改 `l` 参数。

翻译完成后，你将在 `output.srt` 文件中看到翻译好的字幕。如果运行时出现错误，请检查输入文件路径是否正确，OpenAI API KEY 是否已经正确配置。
