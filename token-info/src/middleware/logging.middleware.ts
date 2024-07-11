import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, headers } = req;
    const apiKey = headers['x-api-key'] as string;
    const userAgent = req.get('user-agent') || '';
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const logMessage = `[${timestamp}] ${method} ${originalUrl} ${statusCode} ${contentLength} - API Key: ${apiKey} - User Agent: ${userAgent}`;

      if (statusCode >= 400) {
        this.logger.error(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
