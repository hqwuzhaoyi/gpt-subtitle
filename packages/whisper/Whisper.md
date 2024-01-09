# Whisper

## Model

### Before remake

```
make clean
```

### CoreML

```
./models/download-ggml-model.sh medium.en

./models/generate-coreml-model.sh medium.en
```

WHISPER_COREML=1 make -j

### Metal

```
make
```

### Nvidia

```
WHISPER_CUBLAS=1 make
```

### Bench

./extra/bench-all.sh

https://github.com/ggerganov/whisper.cpp/releases/tag/v1.5.0

https://github.com/ggerganov/whisper.cpp/pull/1472

https://github.com/ggerganov/whisper.cpp/pull/1270

https://github.com/ggerganov/whisper.cpp/issues/1301

## Pervasive Hallucination

https://github.com/ggerganov/whisper.cpp/issues/1507

```
-mc 32 -et 2.8
```
