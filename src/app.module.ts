import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {WebConnection} from "./web socket/web.connection"

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebConnection],
})
export class AppModule {}
