import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TranslateModule } from "./translate/translate.module";
import { UploadModule } from "./upload/upload.module";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { OsrtModule } from "./osrt/osrt.module";
import { BullModule } from "@nestjs/bull";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesModule } from "./files/files.module";
import { SharedModule } from "./shared/shared.module";
import { StaticDirModule, StaticDirProvider } from "./static-dir.provider";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "1241",
      database: "gpt_subtitle",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
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
      rootPath: join(__dirname, "..", "..", "..", "uploads"),
      serveRoot: "/static",
    }),

    TranslateModule,

    UploadModule,
    OsrtModule,
    FilesModule,
    SharedModule,
    StaticDirModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
