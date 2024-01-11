import { execSync } from "child_process";
import { MakeType, WhisperModel } from "./types";
import * as fs from "fs";

export function cleanMake(dir: string) {
  execSync(`cd ${dir} && make clean`, { stdio: "inherit" });
  console.log("Cleaned make in", dir);
}

export function cloneWhisper(dir: string) {
  console.log("Cloning into directory:", dir);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Cleared existing directory: ${dir}`);
  }
  execSync(
    `git clone --branch master https://github.com/ggerganov/whisper.cpp ${dir}`,
    { stdio: "inherit" }
  );
  console.log("Cloned whisper.cpp repository");
}

export function compileWhisper(dir: string, type: MakeType) {
  let command = `cd ${dir} && `;
  if (type === MakeType.Nvidia) {
    command += "WHISPER_CUBLAS=1 make";
  } else if (type === MakeType.Metal) {
    command += "make";
  } else if (type === MakeType.CoreML) {
    command += "WHISPER_COREML=1 make -j";
  }
  execSync(command, { stdio: "inherit" });
  console.log(`Compiled whisper for ${type} in`, dir);
}

export function downloadModel(dir: string) {
  execSync(`cd ${dir} && bash ./models/download-ggml-model.sh base.en`, {
    stdio: "inherit",
  });
  console.log("Downloaded model in", dir);
}

export function runWhisperSample(dir: string) {
  execSync(`cd ${dir} && ./main -f samples/jfk.wav`, { stdio: "inherit" });
  console.log("Ran whisper sample in", dir);
}

export function compileWhisperModel(dir: string, model: WhisperModel) {
  try {
    execSync(`cd ${dir} && make ${model}`, { stdio: "inherit" });
    console.log(`Compiled whisper model: ${model} in`, dir);
  } catch (error) {
    console.error(`Error compiling model: ${model} in ${dir}`, error);
  }
}

export function generateModelForCoreML(dir: string, model: WhisperModel) {
  try {
    execSync(`cd ${dir} && ./models/generate-coreml-model.sh ${model}`, {
      stdio: "inherit",
    });
    console.log(`Generated CoreML model: ${model} in`, dir);
  } catch (error) {
    console.error(`Error generating CoreML model: ${model} in ${dir}`, error);
  }
}

export function setupWhisper({ dir }: { dir: string }) {
  cloneWhisper(dir);
  cleanMake(dir); // Depending on the actual workflow, you might need to clean the make after cloning or before compiling
  compileWhisper(dir, MakeType.Metal);
  downloadModel(dir);
  runWhisperSample(dir);
  compileWhisperModel(dir, WhisperModel.Base);
}
