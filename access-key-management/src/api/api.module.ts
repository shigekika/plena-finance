import { AccessKeyModule } from 'src/modules/access-key';
import { AccessKeyController } from './access-key';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [AccessKeyModule],
  controllers: [AccessKeyController],
  providers: [],
  exports: [],
})
export class ApiModule {}
