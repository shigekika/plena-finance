import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TokenInfoService } from './token-info.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  providers: [TokenInfoService],
  exports: [TokenInfoService],
})
export class TokenInfoModule {}
