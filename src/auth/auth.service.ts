import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.getUserByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Verify password
    const passwordMatch = await this.usersService.verifyPassword(
      user,
      password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.uuid };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }
}
