export enum WhisperModel {
  TinyEn = "tiny.en",
  Tiny = "tiny",
  BaseEn = "base.en",
  Base = "base",
  SmallEn = "small.en",
  Small = "small",
  MediumEn = "medium.en",
  Medium = "medium",
  LargeV1 = "large-v1",
  LargeV2 = "large-v2",
  LargeV3 = "large-v3",
}

export const WhisperModelDescription = {
  [WhisperModel.Tiny]: {
    disk: "75 MiB",
    mem: "~273 MB",
  },
  [WhisperModel.Base]: {
    disk: "142 MiB",
    mem: "~388 MB",
  },
  [WhisperModel.Small]: {
    disk: "466 MiB",
    mem: "~852 MB",
  },
  [WhisperModel.Medium]: {
    disk: "1.5 GIB",
    mem: "~2.1 GB",
  },
  [WhisperModel.LargeV1]: {
    disk: "2.9 GiB",
    mem: "~3.9 GB",
  },
};

export enum MakeType {
  Nvidia,
  Metal,
  CoreML,
}
