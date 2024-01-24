import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { bootstrap } from "global-agent";
import { ValidationPipe } from "@nestjs/common";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function bootstrap2() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  console.debug("SERVER_PORT", process.env.SERVER_PORT);
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
bootstrap2();
