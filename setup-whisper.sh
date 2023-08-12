#!/bin/bash

# 克隆 whisper.cpp 的 master 分支到名为 whisper 的文件夹
git clone --branch master https://github.com/ggerganov/whisper.cpp whisper

# 进入 whisper 文件夹
cd whisper

# 编译项目
make

bash ./models/download-ggml-model.sh base.en

./main -f samples/jfk.wav

# 编译 medium 配置
make base

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

# 输出完成信息
echo "脚本执行完毕!"
