import { Global, Module } from '@nestjs/common';
import { TokenInfoModule } from 'src/modules/token-info.module';
import { TokenInfoController } from './token-info/token-info.controller';

@Global()
@Module({
  imports: [TokenInfoModule],
  controllers: [TokenInfoController],
  providers: [],
})
export class ApiModule {}
