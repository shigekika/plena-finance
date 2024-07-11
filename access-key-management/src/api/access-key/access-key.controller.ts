import { Controller, Put, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccessKeyService } from '../../modules/access-key/access-key.service';
@Controller('access-key')
export class AccessKeyController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @Get(':key')
  getKeyDetails(@Param('key') key: string) {
    return this.accessKeyService.getKeyDetails(key);
  }

  @Put(':key/disable')
  disableKey(@Param('key') key: string) {
    return this.accessKeyService.disableKey(key);
  }

  @MessagePattern('getKeyDetails')
  handleGetKeyDetails(data: { key: string }) {
    return this.accessKeyService.getKeyDetails(data.key);
  }
}
