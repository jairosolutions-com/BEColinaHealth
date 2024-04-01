import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string, tokenExpiresIn: string) {
    const user = await this.usersService.getUserByEmail(username);
    if (!user) {
      
      throw new UnauthorizedException('Invalid username or password');
    }
    const passwordMatch = await this.usersService.verifyPassword(
      user,
      password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Verify password
   
    const expiryPayload = {
      email: user.email,
      sub: user.uuid,
    };
    const expiryToken = this.jwtService.sign(expiryPayload, {
      expiresIn: tokenExpiresIn,
    });
    // Generate JWT token
    return { expiryToken };
  }
}
