import { Command, CommandRunner, Option } from 'nest-commander';
import { LogService } from 'src/common/log.service';
import { AccessKeyService } from 'src/modules/access-key';

interface AccessKeyCommandOptions {
  key?: string;
  description?: string;
  isActive?: boolean;
  rateLimit?: number;
  expiresAt?: Date;
  id?: string;
}

@Command({
  name: 'accesskey',
  description: 'Manage access keys',
  subCommands: [],
})
export class AccessKeyCommand extends CommandRunner {
  constructor(
    private readonly accessKeyService: AccessKeyService,
    private readonly logService: LogService,
  ) {
    super();
  }

  async run(
    passedParam: string[],
    options?: AccessKeyCommandOptions,
  ): Promise<void> {
    const action = passedParam[0];

    switch (action) {
      case 'create':
        await this.create(options);
        break;
      case 'update':
        await this.update(options);
        break;
      case 'delete':
        await this.delete(options);
        break;
      case 'list':
        await this.list();
        break;
      default:
        this.logService.log(
          'Invalid action. Use list, create, update, or delete.',
        );
    }
  }

  async create(options: AccessKeyCommandOptions): Promise<void> {
    const { rateLimit, expiresAt } = options;
    const accessKey = await this.accessKeyService.createKey(
      rateLimit,
      expiresAt,
    );
    this.logService.log('Access key created', 'id:' + accessKey.id);
  }

  async update(options: AccessKeyCommandOptions): Promise<void> {
    const { id, rateLimit, expiresAt } = options;
    const accessKey = await this.accessKeyService.updateKey(
      id,
      rateLimit,
      expiresAt,
    );
    this.logService.log('Access key updated', 'id:' + accessKey.id);
  }

  async delete(options: AccessKeyCommandOptions): Promise<void> {
    const { id } = options;
    await this.accessKeyService.deleteKey(id);
    this.logService.log('Access key deleted successfully.');
  }

  async list(): Promise<void> {
    const accessKeyList = await this.accessKeyService.list();
    this.logService.log('Access key list:', accessKeyList);
  }

  @Option({
    flags: '-i, --id <id>',
    description: 'The ID of the access key (required for update and delete)',
  })
  parseId(val: string): string {
    return val;
  }

  @Option({
    flags: '-a, --is-active <isActive>',
    description: 'Is the access key active (optional for update)',
  })
  parseIsActive(val: string): boolean {
    return val === 'true';
  }

  @Option({
    flags: '-r, --rate-limit <rateLimit>',
    description: 'The rate limit for the access key (required for create)',
  })
  parseRateLimit(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-e, --expires-at <expiresAt>',
    description: 'The expiration date for the access key (required for create)',
  })
  parseExpiresAt(val: string): Date {
    return new Date(val);
  }
}
