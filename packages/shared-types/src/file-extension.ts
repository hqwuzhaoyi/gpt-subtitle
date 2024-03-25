const videoExtensions = ["mp4", "mkv", "avi", "mov", "flv", "wmv"];
const audioExtensions = ["mp3", "wav", "ogg", "flac"];
const subtitleExtensions = ["srt", "ass", "sub", "ssa", "idx", "vtt"];

const subtitleExtensionsRegex = subtitleExtensions.join("|");

export {
  videoExtensions,
  audioExtensions,
  subtitleExtensions,
  subtitleExtensionsRegex,
};
