/* eslint-disable import/no-anonymous-default-export */
import httpProxy from "http-proxy";

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req: any, res: any) => {
  req.url = req.url.replace(/^\/api\/proxy/, "");
  return new Promise((resolve, reject) => {
    const proxy: httpProxy = httpProxy.createProxy();

    proxy
      .once("proxyRes", resolve)
      .once("error", reject)
      .web(req, res, {
        changeOrigin: true,
        target: req.cookies?.proxyUrl || process.env.NEXT_PUBLIC_API_URL,
      });
  });
};
