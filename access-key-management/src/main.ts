import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CommandFactory } from 'nest-commander';

import { AppModule } from './app.module';

async function bootstrap() {
  const args = process.argv.slice(2);
  if (args.includes('accesskey')) {
    // If running a command, use CommandFactory
    await CommandFactory.run(AppModule);
  } else {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });

    await app.startAllMicroservices();
    await app.listen(3001);
  }
}
bootstrap();
