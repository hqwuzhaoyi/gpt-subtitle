import axios from "axios";


export const baseURL =
  process.env.API_URL || `http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}`;

export const staticPath = `baseURL/${process.env.STATIC_PATH}`;

console.debug("baseURL", baseURL);

export const request = axios.create({
  // .. congigure axios baseURL
  baseURL: `${baseURL}`,
});
