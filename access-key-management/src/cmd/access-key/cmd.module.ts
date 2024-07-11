import { Module } from '@nestjs/common';
import { CommandRunnerModule } from 'nest-commander';
import { AccessKeyCommand } from './access-key.command';
import { AccessKeyModule } from 'src/modules/access-key';
import { LogService } from 'src/common/log.service';

@Module({
  imports: [CommandRunnerModule, AccessKeyModule],
  providers: [LogService, AccessKeyCommand],
})
export class CommandModule {}
