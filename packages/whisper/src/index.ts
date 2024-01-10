import * as path from "path";
import * as child_process from "child_process";
// import * as execa from "execa";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);
// const child = child_process.spawn("node", ["./path/to/other/script.js"]);

export let mainProcessMap = new Map<string, child_process.ChildProcess>();

export interface WhisperInterface {
  (
    targetPath: string,
    videoLanguage: string,
    model?: string,
    id?: string,
    sendEvent?: (data) => void,
    options?: {
      mc?: string;
      et?: string;
      prompt?: string;
      threads?: string;
    }
  ): Promise<number | string>;
}

export const whisper: WhisperInterface = async (
  targetPath,
  videoLanguage,
  model = "ggml-medium.bin",
  id = "main",
  sendEvent,
  { mc, et, prompt, threads } = {}
) => {
  const whisperRoot = path.join(__dirname, "..", "..", "..", "whisper");
  console.log("whisperRoot", whisperRoot);
  const mainPath = path.join(whisperRoot, "main");
  const modelPath = path.join(whisperRoot, "models", model);
  console.log("modelPath", modelPath);

  if (mainProcessMap.has(id)) {
    console.log("mainProcessMap.has(id)", id);
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

  const maxContentArgs = mc ? ["-mc", mc] : [];
  const entropyTholdArgs = et ? ["-et", et] : [];
  const promptArgs = prompt ? ["--prompt", prompt] : [];
  const threadsArgs = threads ? ["-t", threads] : [];

  const args = [
    "-f",
    `"${targetPath}"`,
    "-osrt",
    "-l",
    videoLanguage,
    "-m",
    modelPath,
    ...maxContentArgs,
    ...entropyTholdArgs,
    ...promptArgs,
    ...threadsArgs,
  ];

  console.log("args", args.join(" "));

  return new Promise((resolve, reject) => {
    let mainProcess = child_process.spawn(mainPath, args, { shell: true });
    mainProcessMap.set(id, mainProcess);

    mainProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);

      sendEvent && sendEvent(data);
    });

    mainProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      sendEvent && sendEvent(data);
    });
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
  });
};

export const stopAllWhisper = () => {
  for (let [key, value] of mainProcessMap) {
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
        "-y",
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
