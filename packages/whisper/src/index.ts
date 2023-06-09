import * as path from "path";
import * as child_process from "child_process";
// import * as execa from "execa";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);
// const child = child_process.spawn("node", ["./path/to/other/script.js"]);

let mainProcess = null;

export const whisper = async (
  targetPath,
  videoLanguage,
  model = "ggml-medium.bin"
) => {
  const whisperRoot = path.join(__dirname, "..", "..", "..", "whisper");
  console.log("whisperRoot", whisperRoot);
  const mainPath = path.join(whisperRoot, "main");
  const modelPath = path.join(whisperRoot, "models", model);
  console.log("modelPath", modelPath);

  // const targetPath = path.join(
  //   __dirname,
  //   "..",
  //   "..",
  //   "..",
  //   "samples",
  //   videoPath
  // );

  return new Promise((resolve, reject) => {
    mainProcess = child_process.spawn(
      mainPath,
      ["-f", `"${targetPath}"`, "-osrt", "-l", videoLanguage, "-m", modelPath],
      { shell: true }
    );
    mainProcess.stdout.pipe(process.stdout);
    mainProcess.stderr.pipe(process.stderr);
    mainProcess.on("error", reject);
    mainProcess.on("close", (code) => {
      mainProcess = null;
      console.log("whisper close", code);
      resolve(code);
    });

    mainProcess.on("exit", (code, signal) => {
      console.log(`whisper exit with code ${code} and signal ${signal}`);
      if (signal === "SIGTERM") {
        console.log("whisper SIGTERM");
        resolve(signal);
      }
    });
  });
};

export const stopWhisper = () => {
  if (mainProcess) {
    console.log("stopWhisper");
    mainProcess.kill();
    mainProcess = null;
  }
};

export const extractAudio = async (targetPath, aduioPath) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = child_process.spawn(
      "ffmpeg",
      [
        "-i",
        `"${targetPath}"`,
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "2",
        `"${aduioPath}"`,
      ],
      { shell: true }
    );

    ffmpeg.stdout.pipe(process.stdout);
    ffmpeg.stderr.pipe(process.stderr);
    ffmpeg.on("error", reject);
    ffmpeg.on("close", resolve);
  });
};

// whisper("jfk.wav", "en");
