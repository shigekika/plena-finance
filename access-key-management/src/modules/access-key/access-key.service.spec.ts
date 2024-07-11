import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKey } from '../../entities/access-key.entity';
import { AccessKeyService } from './access-key.service';

describe('AccessKeyService', () => {
  let service: AccessKeyService;
  let repository: Repository<AccessKey>;

  const mockAccessKeyRepository = {
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessKeyService,
        {
          provide: getRepositoryToken(AccessKey),
          useValue: mockAccessKeyRepository,
        },
      ],
    }).compile();

    service = module.get<AccessKeyService>(AccessKeyService);
    repository = module.get<Repository<AccessKey>>(
      getRepositoryToken(AccessKey),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return an array of access keys', async () => {
      const result = [new AccessKey()];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.list()).toBe(result);
    });
  });

  describe('createKey', () => {
    it('should create and return an access key', async () => {
      const result = new AccessKey();
      result.key = 'randomKey';
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.createKey(100, new Date())).toBe(result);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('updateKey', () => {
    it('should update and return an access key', async () => {
      const key = new AccessKey();
      jest.spyOn(repository, 'findOne').mockResolvedValue(key);
      jest.spyOn(repository, 'save').mockResolvedValue(key);

      expect(await service.updateKey('1', 100, new Date())).toBe(key);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.save).toHaveBeenCalledWith(key);
    });
  });

  describe('getKeyDetails', () => {
    it('should return an access key', async () => {
      const result = new AccessKey();
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.getKeyDetails('randomKey')).toBe(result);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { key: 'randomKey' },
      });
    });
  });

  describe('disableKey', () => {
    it('should disable and return an access key', async () => {
      const key = new AccessKey();
      key.isActive = true;
      jest.spyOn(repository, 'findOne').mockResolvedValue(key);
      jest.spyOn(repository, 'save').mockResolvedValue(key);

      expect(await service.disableKey('randomKey')).toBe(key);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { key: 'randomKey' },
      });
      expect(repository.save).toHaveBeenCalledWith(key);
    });
  });
});
