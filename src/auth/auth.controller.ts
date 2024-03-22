import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.input'; // Import the SignInDto
import { ApiKeyGuard } from 'src/auth/api-key/api-key.guard';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    // Use SignInDto here
    const expiryToken = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
      signInDto.tokenExpiresIn,
    );
    return expiryToken;
  }
}
