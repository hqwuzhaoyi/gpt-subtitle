import axios from "axios";

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  `http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}`;

export const staticPath = `${baseURL}${process.env.STATIC_PATH}/`;
export const videoDirPath = `${baseURL}${process.env.STATIC_PATH}/video/`;

console.debug("baseURL", baseURL);

export const request = axios.create({
  // .. configure axios baseURL
  baseURL: `${baseURL}`,
});
