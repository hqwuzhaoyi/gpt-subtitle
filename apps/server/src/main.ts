import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { bootstrap } from "global-agent";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function bootstrap2() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.debug("SERVER_PORT", process.env.SERVER_PORT);
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
bootstrap2();
