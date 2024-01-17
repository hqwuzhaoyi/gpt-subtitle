import { exec } from "child_process";
import { MakeType, WhisperModel } from "./types";
import * as fs from "fs";
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runCommand(command: string) {
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  } catch (error) {
    console.error('Error during command execution', error);
  }
}

export async function cleanMake(dir: string) {
  await runCommand(`cd ${dir} && make clean`);
  console.log("Cleaned make in", dir);
}

export async function cloneWhisper(dir: string) {
  console.log("Cloning into directory:", dir);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Cleared existing directory: ${dir}`);
  }
  await runCommand(`git clone --branch master https://github.com/ggerganov/whisper.cpp ${dir}`);
  console.log("Cloned whisper.cpp repository");
}

export async function compileWhisper(dir: string, type: MakeType) {
  let command = `cd ${dir} && `;
  if (type === MakeType.Nvidia) {
    command += "WHISPER_CUBLAS=1 make";
  } else if (type === MakeType.Metal) {
    command += "make";
  } else if (type === MakeType.CoreML) {
    command += "WHISPER_COREML=1 make -j";
  }
  await runCommand(command);
  console.log(`Compiled whisper for ${type} in`, dir);
}

export async function downloadModel(dir: string) {
  await runCommand(`cd ${dir} && bash ./models/download-ggml-model.sh base.en`);
  console.log("Downloaded model in", dir);
}

export async function runWhisperSample(dir: string) {
  await runCommand(`cd ${dir} && ./main -f samples/jfk.wav`);
  console.log("Ran whisper sample in", dir);
}

export async function compileWhisperModel(dir: string, model: WhisperModel) {
  try {
    await runCommand(`cd ${dir} && make ${model}`);
    console.log(`Compiled whisper model: ${model} in`, dir);
  } catch (error) {
    console.error(`Error compiling model: ${model} in ${dir}`, error);
  }
}

export async function generateModelForCoreML(dir: string, model: WhisperModel) {
  try {
    await runCommand(`cd ${dir} && ./models/generate-coreml-model.sh ${model}`);
    console.log(`Generated CoreML model: ${model} in`, dir);
  } catch (error) {
    console.error(`Error generating CoreML model: ${model} in ${dir}`, error);
  }
}

export async function setupWhisper({ dir }: { dir: string }) {
  await cloneWhisper(dir);
  await cleanMake(dir); // Depending on the actual workflow, you might need to clean the make after cloning or before compiling
  await compileWhisper(dir, MakeType.Metal);
  await downloadModel(dir);
  await runWhisperSample(dir);
  await compileWhisperModel(dir, WhisperModel.Base);
}
