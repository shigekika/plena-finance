import { Test, TestingModule } from '@nestjs/testing';
import { TokenInfoService } from './token-info.service';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { RateLimiterMemory } from 'rate-limiter-flexible';

describe('TokenInfoService', () => {
  let service: TokenInfoService;
  let httpService: HttpService;
  let clientProxy: ClientProxy;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenInfoService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: 'REDIS_CLIENT', useValue: mockClientProxy },
      ],
    }).compile();

    service = module.get<TokenInfoService>(TokenInfoService);
    httpService = module.get<HttpService>(HttpService);
    clientProxy = module.get<ClientProxy>('REDIS_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getKeyDetails', () => {
    it('should return key details', async () => {
      const keyDetails = { rateLimit: 100, expiresAt: new Date() };
      jest.spyOn(clientProxy, 'send').mockReturnValue(of(keyDetails));

      expect(await service.getKeyDetails('validKey')).toBe(keyDetails);
      expect(clientProxy.send).toHaveBeenCalledWith('getKeyDetails', {
        key: 'validKey',
      });
    });
  });

  describe('checkRateLimit', () => {
    it('should not throw exception if rate limit not exceeded', async () => {
      const rateLimiter = new RateLimiterMemory({ points: 10, duration: 60 });
      service['rateLimiters']['validKey'] = rateLimiter;

      await expect(
        service.checkRateLimit('validKey', 10),
      ).resolves.not.toThrow();
    });

    it('should throw BadRequestException if rate limit exceeded', async () => {
      const rateLimiter = new RateLimiterMemory({ points: 1, duration: 60 });
      await rateLimiter.consume('validKey');
      service['rateLimiters']['validKey'] = rateLimiter;

      await expect(service.checkRateLimit('validKey', 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getTokenInfo', () => {
    it('should return token info', async () => {
      const axiosResponse: AxiosResponse<any> = {
        data: { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
        },
        config: {
          url: 'https://api.coingecko.com/api/v3/coins/bitcoin',
          method: 'get',
          headers: new AxiosHeaders(),
        },
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

      expect(await service.getTokenInfo('bitcoin')).toBe(axiosResponse);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/bitcoin',
      );
    });
  });
});
