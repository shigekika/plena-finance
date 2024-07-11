import { Module } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey } from 'src/entities/access-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessKey])],
  providers: [AccessKeyService],
  exports: [AccessKeyService],
})
export class AccessKeyModule {}
