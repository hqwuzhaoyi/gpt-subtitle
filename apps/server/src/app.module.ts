import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslateModule } from './translate/translate.module';
import { FileLoaderModule } from './file-loader/file-loader.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.development.local',
        '.env.development',
        '.env',
        '.env.local',
      ],
    }),
    TranslateModule,
    FileLoaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
