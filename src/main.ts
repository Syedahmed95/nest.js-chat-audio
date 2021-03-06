import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigModule } from "@nestjs/config"

async function bootstrap() {
  ConfigModule.forRoot()
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname,"..",'static'))
  const PORT = process.env.PORT || 3000
  await app.listen(PORT);
  console.log(`Listening to PORT ${PORT}`)
}
bootstrap();
