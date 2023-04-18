import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from 'global-agent';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

async function bootstrap2() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
bootstrap2();
