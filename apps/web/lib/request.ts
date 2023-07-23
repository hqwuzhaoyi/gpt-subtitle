import axios from "axios";

export const request = axios.create({
  // .. configure axios baseURL
  baseURL: process.env.NEXT_PUBLIC_API_URL || `http://localhost:3001`,
});
