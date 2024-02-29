import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // 'x-api-key' is a custom header where the API key is expected
    return this.validateApiKey(apiKey);
  }

  private validateApiKey(apiKey: string): boolean {
    const validApiKey = process.env.VALID_API_KEY; // Store your valid API keys in environment variables or a secure storage
    return apiKey === validApiKey;
  }
}
