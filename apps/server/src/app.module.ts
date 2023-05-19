import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TranslateModule } from "./translate/translate.module";
import { FileLoaderModule } from "./file-loader/file-loader.module";
import { UploadModule } from "./upload/upload.module";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { OsrtModule } from './osrt/osrt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        ".env.development.local",
        ".env.development",
        ".env",
        ".env.local",
      ],
    }),
    MulterModule.register({
      dest: "./uploads",
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: '/static'
    }),

    TranslateModule,
    FileLoaderModule,
    UploadModule,
    OsrtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
