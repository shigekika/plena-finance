import { Test, TestingModule } from '@nestjs/testing';
import { AccessKeyController } from './access-key.controller';
import { AccessKeyService } from '../../modules/access-key/access-key.service';
import { AccessKey } from '../../entities/access-key.entity';

describe('AccessKeyController', () => {
  let controller: AccessKeyController;
  let service: AccessKeyService;

  const mockAccessKeyService = {
    getKeyDetails: jest.fn(),
    disableKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessKeyController],
      providers: [
        {
          provide: AccessKeyService,
          useValue: mockAccessKeyService,
        },
      ],
    }).compile();

    controller = module.get<AccessKeyController>(AccessKeyController);
    service = module.get<AccessKeyService>(AccessKeyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getKeyDetails', () => {
    it('should return access key details', async () => {
      const result = new AccessKey();
      jest.spyOn(service, 'getKeyDetails').mockResolvedValue(result);

      expect(await controller.getKeyDetails('randomKey')).toBe(result);
      expect(service.getKeyDetails).toHaveBeenCalledWith('randomKey');
    });
  });

  describe('disableKey', () => {
    it('should disable and return access key', async () => {
      const result = new AccessKey();
      jest.spyOn(service, 'disableKey').mockResolvedValue(result);

      expect(await controller.disableKey('randomKey')).toBe(result);
      expect(service.disableKey).toHaveBeenCalledWith('randomKey');
    });
  });

  describe('handleGetKeyDetails', () => {
    it('should handle get key details message', async () => {
      const result = new AccessKey();
      jest.spyOn(service, 'getKeyDetails').mockResolvedValue(result);

      expect(await controller.handleGetKeyDetails({ key: 'randomKey' })).toBe(
        result,
      );
      expect(service.getKeyDetails).toHaveBeenCalledWith('randomKey');
    });
  });
});
