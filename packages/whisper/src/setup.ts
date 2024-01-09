import { execSync } from "child_process";
import { MakeType, WhisperModel } from "./types";
import chalk from "chalk";

export function cleanMake() {
  execSync("cd whisper && make clean", { stdio: "inherit" });
  console.log(chalk.red("Cleaned make"));
}

function cloneWhisper() {
  execSync(
    "git clone --branch master https://github.com/ggerganov/whisper.cpp whisper"
  );
  console.log(chalk.green("Cloned whisper.cpp repository"));
}

function compileWhisper(type: MakeType) {
  if (type === MakeType.Nvidia) {
    execSync("cd whisper && WHISPER_CUBLAS=1 make", { stdio: "inherit" });
  } else if (type === MakeType.Metal) {
    execSync("cd whisper && make", { stdio: "inherit" });
  } else if (type === MakeType.CoreML) {
    execSync("cd whisper && WHISPER_COREML=1 make -j", { stdio: "inherit" });
  }

  console.log(chalk.blue("Compiled whisper"));
}

function downloadModel() {
  execSync("cd whisper && bash ./models/download-ggml-model.sh base.en", {
    stdio: "inherit",
  });
  console.log(chalk.magenta("Downloaded model"));
}

function runWhisperSample() {
  execSync("cd whisper && ./main -f samples/jfk.wav", { stdio: "inherit" });
  console.log(chalk.cyan("Ran whisper sample"));
}

export function compileWhisperModel(model: WhisperModel) {
  try {
    execSync(`cd whisper && make ${model}`, { stdio: "inherit" });
    console.log(chalk.yellow(`Compiled whisper model: ${model}`));
  } catch (error) {
    console.error(chalk.red(`Error compiling model: ${model}`), error);
  }
}
export function generateModelForCoreML(model: WhisperModel) {
  try {
    execSync(`cd whisper && ./models/generate-coreml-model.sh ${model}`, {
      stdio: "inherit",
    });
    console.log(chalk.yellow(`Generated CoreML model: ${model}`));
  } catch (error) {
    console.error(chalk.red(`Error generating CoreML model: ${model}`), error);
  }
}

export function setupWhisper() {
  cloneWhisper();
  compileWhisper(MakeType.Metal);
  downloadModel();
  runWhisperSample();
  compileWhisperModel(WhisperModel.Base);
}
