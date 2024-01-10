import { execSync } from "child_process";
import { MakeType, WhisperModel } from "./types";
import * as fs from "fs";
export function cleanMake() {
  execSync("cd whisper && make clean", { stdio: "inherit" });
  console.log("Cleaned make");
}

function cloneWhisper(dir) {
  console.log('dir', dir)
  if (fs.existsSync(dir)) {
    // Delete the contents of the directory
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Cleared existing directory: ${dir}`);
  }
  execSync(
    "git clone --branch master https://github.com/ggerganov/whisper.cpp " + dir,
    { stdio: "inherit" } // Display the output in the terminal
  );
  console.log("Cloned whisper.cpp repository");
}

function compileWhisper(type: MakeType) {
  if (type === MakeType.Nvidia) {
    execSync("cd whisper && WHISPER_CUBLAS=1 make", { stdio: "inherit" });
  } else if (type === MakeType.Metal) {
    execSync("cd whisper && make", { stdio: "inherit" });
  } else if (type === MakeType.CoreML) {
    execSync("cd whisper && WHISPER_COREML=1 make -j", { stdio: "inherit" });
  }

  console.log("Compiled whisper");
}

function downloadModel() {
  execSync("cd whisper && bash ./models/download-ggml-model.sh base.en", {
    stdio: "inherit",
  });
  console.log("Downloaded model");
}

function runWhisperSample() {
  execSync("cd whisper && ./main -f samples/jfk.wav", { stdio: "inherit" });
  console.log("Ran whisper sample");
}

export function compileWhisperModel(model: WhisperModel) {
  try {
    execSync(`cd whisper && make ${model}`, { stdio: "inherit" });
    console.log(`Compiled whisper model: ${model}`);
  } catch (error) {
    console.error(`Error compiling model: ${model}`, error);
  }
}
export function generateModelForCoreML(model: WhisperModel) {
  try {
    execSync(`cd whisper && ./models/generate-coreml-model.sh ${model}`, {
      stdio: "inherit",
    });
    console.log(`Generated CoreML model: ${model}`);
  } catch (error) {
    console.error(`Error generating CoreML model: ${model}`, error);
  }
}

export function setupWhisper({ dir }) {
  cloneWhisper(dir);
  compileWhisper(MakeType.Metal);
  downloadModel();
  runWhisperSample();
  compileWhisperModel(WhisperModel.Base);
}
