import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessKey } from '../../entities/access-key.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessKeyService {
  constructor(
    @InjectRepository(AccessKey)
    private accessKeyRepository: Repository<AccessKey>,
  ) {}

  async list(): Promise<AccessKey[]> {
    return await this.accessKeyRepository.find();
  }

  async createKey(rateLimit: number, expiresAt: Date): Promise<AccessKey> {
    const key = new AccessKey();
    key.key = Math.random().toString(36).substring(2, 15); // Generate a random key
    key.rateLimit = rateLimit;
    key.expiresAt = expiresAt;
    return this.accessKeyRepository.save(key);
  }

  async deleteKey(id: string): Promise<void> {
    await this.accessKeyRepository.delete(id);
  }

  async updateKey(
    id: string,
    rateLimit: number,
    expiresAt: Date,
  ): Promise<AccessKey> {
    const key = await this.accessKeyRepository.findOne({ where: { id } });
    key.rateLimit = rateLimit;
    key.expiresAt = expiresAt;
    return this.accessKeyRepository.save(key);
  }

  async getKeyDetails(key: string): Promise<AccessKey> {
    return this.accessKeyRepository.findOne({ where: { key } });
  }

  async disableKey(key: string): Promise<AccessKey> {
    const accessKey = await this.accessKeyRepository.findOne({
      where: { key },
    });
    accessKey.isActive = false;
    return this.accessKeyRepository.save(accessKey);
  }
}
