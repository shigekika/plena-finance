import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AxiosResponse } from 'axios';

@Injectable()
export class TokenInfoService {
  private rateLimiters: { [key: string]: RateLimiterMemory } = {};

  constructor(
    private readonly httpService: HttpService,
    @Inject('REDIS_CLIENT') private readonly client: ClientProxy,
  ) {}

  async getKeyDetails(
    key: string,
  ): Promise<{ rateLimit: number; expiresAt: Date }> {
    try {
      const response = await firstValueFrom(
        this.client.send('getKeyDetails', { key }),
      );
      return response;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired API key');
    }
  }

  async checkRateLimit(key: string, rateLimit: number): Promise<void> {
    if (!this.rateLimiters[key]) {
      this.rateLimiters[key] = new RateLimiterMemory({
        points: rateLimit,
        duration: 60,
      });
    }

    try {
      await this.rateLimiters[key].consume(key);
    } catch (rejRes) {
      throw new BadRequestException('Rate limit exceeded');
    }
  }

  async getTokenInfo(tokenId: string): Promise<AxiosResponse<any>> {
    return this.httpService
      .get(`https://api.coingecko.com/api/v3/coins/${tokenId}`)
      .toPromise();
  }
}
