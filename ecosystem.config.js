require("dotenv").config();

const {
  OPENAI_API_KEY,
  GOOGLE_TRANSLATE_API_KEY,
  BASE_URL,
  WEB_PORT,
  SERVER_PORT,
  NEXT_PUBLIC_SERVER_PORT,
  LANGUAGE,
  OUTPUT_SRT_THEN_TRANSLATE,
  REDIS_PORT,
  REDIS_HOST,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

const serverEnv = {
  OPENAI_API_KEY,
  GOOGLE_TRANSLATE_API_KEY,
  BASE_URL,
  WEB_PORT,
  SERVER_PORT,
  NEXT_PUBLIC_SERVER_PORT,
  LANGUAGE,
  OUTPUT_SRT_THEN_TRANSLATE,
  REDIS_PORT,
  REDIS_HOST,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
};

// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "GptSubtitleWeb",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "apps/web/node_modules/next/dist/bin/next",
      args: "start",
      env_local: {
        APP_ENV: "local", // APP_ENV=local
        PORT: WEB_PORT,
        ...serverEnv,
      },
      env_development: {
        APP_ENV: "dev", // APP_ENV=dev
        PORT: WEB_PORT,
        ...serverEnv,
      },
      env_production: {
        APP_ENV: "prod", // APP_ENV=prod
        PORT: WEB_PORT,
        ...serverEnv,
      },
      cwd: "apps/web", // 设置当前工作目录
    },
    {
      name: "GptSubtitleServer",
      instances: 1,
      script: "apps/server/dist/main.js",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env_local: {
        NODE_ENV: "development",
        ...serverEnv,
      },
      env_development: {
        NODE_ENV: "development",
        ...serverEnv,
      },
      env_production: {
        NODE_ENV: "production",
        ...serverEnv,
      },
    },
  ],
};
