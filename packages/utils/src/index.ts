// export const baseURL =
//   process.env.API_URL ||
//   `http://localhost:${process.env.SERVER_PORT || 3001}`;

export const baseURL = "/api/proxy";

export const staticPath = `${process.env.API_URL}${
  process.env.STATIC_PATH || "/static"
}/`;
export const videoDirPath = `${process.env.API_URL}${
  process.env.STATIC_PATH || "/static"
}/video/`;
