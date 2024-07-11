import { Test, TestingModule } from '@nestjs/testing';
import { TokenInfoController } from './token-info.controller';
import { TokenInfoService } from '../../modules/token-info.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders } from 'axios';

describe('TokenInfoController', () => {
  let controller: TokenInfoController;
  let service: TokenInfoService;

  const mockTokenInfoService = {
    getKeyDetails: jest.fn(),
    checkRateLimit: jest.fn(),
    getTokenInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenInfoController],
      providers: [
        {
          provide: TokenInfoService,
          useValue: mockTokenInfoService,
        },
      ],
    }).compile();

    controller = module.get<TokenInfoController>(TokenInfoController);
    service = module.get<TokenInfoService>(TokenInfoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTokenInfo', () => {
    it('should throw BadRequestException if API key is missing', async () => {
      await expect(controller.getTokenInfo('bitcoin', '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if API key has expired', async () => {
      const keyDetails = {
        rateLimit: 100,
        expiresAt: new Date(Date.now() - 1000),
      }; // Expired key
      jest.spyOn(service, 'getKeyDetails').mockResolvedValue(keyDetails);

      await expect(
        controller.getTokenInfo('bitcoin', 'expiredKey'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should check rate limit and return token info', async () => {
      const keyDetails = {
        rateLimit: 100,
        expiresAt: new Date(Date.now() + 10000),
      }; // Valid key
      const tokenInfo: AxiosResponse<any, any> = {
        data: { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'https://api.coingecko.com/api/v3/coins/bitcoin',
          method: 'get',
          headers: new AxiosHeaders(),
        },
        request: {},
      };

      jest.spyOn(service, 'getKeyDetails').mockResolvedValue(keyDetails);
      jest.spyOn(service, 'checkRateLimit').mockResolvedValue(undefined);
      jest.spyOn(service, 'getTokenInfo').mockResolvedValue(tokenInfo);

      expect(await controller.getTokenInfo('bitcoin', 'validKey')).toBe(
        tokenInfo.data,
      );
      expect(service.getKeyDetails).toHaveBeenCalledWith('validKey');
      expect(service.checkRateLimit).toHaveBeenCalledWith('validKey', 100);
      expect(service.getTokenInfo).toHaveBeenCalledWith('bitcoin');
    });
  });
});
