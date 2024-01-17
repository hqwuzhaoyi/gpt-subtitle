import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TranslateModule } from "./translate/translate.module";
import { UploadModule } from "./upload/upload.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { OsrtModule } from "./osrt/osrt.module";
import { BullModule } from "@nestjs/bull";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesModule } from "./files/files.module";
import { SharedModule } from "./shared/shared.module";
import { StaticDirModule } from "./static-dir.provider";

import { BullBoardModule } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";
import { SubtitleModule } from "./subtitle/subtitle.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

import * as fs from "fs-extra";
import * as path from "path";
import { CustomConfigModule } from "./config/config.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { WhisperModule } from "./whisper/whisper.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

const {
  REDIS_PORT = 6379,
  REDIS_HOST = "localhost",
  MYSQL_HOST = "localhost",
  MYSQL_PORT = 3306,
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "123456",
  MYSQL_DATABASE = "gpt_subtitle",
} = process.env;

const rootPath = path.join(__dirname, "..", "..", "..");

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: MYSQL_HOST,
      port: +MYSQL_PORT,
      username: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: REDIS_HOST,
        port: +REDIS_PORT,
      },
    }),
    BullBoardModule.forRoot({
      route: "/queues",
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
    }),
    ConfigModule.forRoot({
      envFilePath: [
        ".env.development.local",
        ".env.development",
        ".env",
        ".env.local",
      ],
    }),
    // MulterModule.register({
    //   dest: "./uploads",
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(rootPath, "uploads"),
      serveRoot: "/static",
    }),
    CustomConfigModule,
    SharedModule,

    TranslateModule,

    UploadModule,
    OsrtModule,
    FilesModule,

    StaticDirModule,
    SubtitleModule,
    AuthModule,
    UsersModule,
    WhisperModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    AppService,
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    const whisperDir = path.join(rootPath, "whisper");
    const modelsDir = path.join(whisperDir, "models");
    try {
      await fs.ensureDir(modelsDir);
    } catch (err) {
      console.error(`Failed to ensure directory ${modelsDir}: `, err);
    }
    const uploadsDir = path.join(rootPath, "uploads");
    const videoDir = path.join(uploadsDir, "video");
    try {
      await fs.ensureDir(videoDir);
    } catch (err) {
      console.error(`Failed to ensure directory ${videoDir}: `, err);
    }
  }
}
