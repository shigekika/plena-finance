import {
  Controller,
  Get,
  Query,
  Headers,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { TokenInfoService } from '../../modules/token-info.service';

@Controller('token-info')
export class TokenInfoController {
  private readonly logger = new Logger(TokenInfoController.name);

  constructor(private readonly tokenService: TokenInfoService) {}

  @Get()
  async getTokenInfo(
    @Query('tokenId') tokenId: string,
    @Headers('x-api-key') apiKey: string,
  ) {
    const timestamp = new Date().toISOString();

    if (!apiKey) {
      this.logger.warn(`[${timestamp}] Missing API key`);
      throw new BadRequestException('API key is required');
    }

    const { rateLimit, expiresAt } =
      await this.tokenService.getKeyDetails(apiKey);

    if (new Date() > new Date(expiresAt)) {
      this.logger.warn(`[${timestamp}] Expired API key: ${apiKey}`);
      throw new UnauthorizedException('API key has expired');
    }

    await this.tokenService.checkRateLimit(apiKey, rateLimit);

    const tokenInfo = await this.tokenService.getTokenInfo(tokenId);

    this.logger.log(
      `[${timestamp}] Token info fetched for ${tokenId} using key ${apiKey}`,
    );

    return tokenInfo.data;
  }
}
