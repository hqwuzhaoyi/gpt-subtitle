import * as path from "path";
import * as child_process from "child_process";
// import * as execa from "execa";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);
// const child = child_process.spawn("node", ["./path/to/other/script.js"]);

let mainProcessMap = new Map<string, child_process.ChildProcess>();

export const whisper = async (
  targetPath,
  videoLanguage,
  model = "ggml-medium.bin",
  id = "main",
) => {
  const whisperRoot = path.join(__dirname, "..", "..", "..", "whisper");
  console.log("whisperRoot", whisperRoot);
  const mainPath = path.join(whisperRoot, "main");
  const modelPath = path.join(whisperRoot, "models", model);
  console.log("modelPath", modelPath);

  if (mainProcessMap.has(targetPath)) {
    console.log("mainProcessMap.has(targetPath)", targetPath);
    return;
  }

  // const targetPath = path.join(
  //   __dirname,
  //   "..",
  //   "..",
  //   "..",
  //   "samples",
  //   videoPath
  // );

  return new Promise((resolve, reject) => {
    let mainProcess = child_process.spawn(
      mainPath,
      ["-f", `"${targetPath}"`, "-osrt", "-l", videoLanguage, "-m", modelPath],
      { shell: true }
    );
    mainProcess.stdout.pipe(process.stdout);
    mainProcess.stderr.pipe(process.stderr);
    mainProcess.on("error", reject);
    mainProcess.on("close", (code) => {
      mainProcess = null;
      mainProcessMap.delete(id);
      console.log("whisper close", code);
      resolve(code);
    });

    mainProcess.on("exit", (code, signal) => {
      console.log(`whisper exit with code ${code} and signal ${signal}`);
      if (signal === "SIGTERM") {
        console.log("whisper SIGTERM");
        resolve(signal);
        mainProcessMap.delete(id);
      }
    });
    mainProcessMap.set(id, mainProcess);
  });
};

export const stopAllWhisper = () => {
  for (let [key, value] of mainProcessMap) {
    console.log(key, value);
    value.kill("SIGTERM");
  }
  mainProcessMap.clear();
};

export const stopWhisper = (id) => {
  if (!id) {
    throw new Error("stopWhisper id is required");
  } else {
    const whisperProcess = mainProcessMap.get(id);
    if (whisperProcess) {
      whisperProcess.kill("SIGTERM");
      mainProcessMap.delete(id);
    }
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
