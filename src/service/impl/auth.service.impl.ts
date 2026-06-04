import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserRepository } from '../../repository/user.repository';
import { JwtUtil } from '../../security/jwt.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceImpl implements AuthService {

  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtUtil: JwtUtil
  ) {}

  async login(username: string, password: string) {

    const user = await this.userRepo.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.enabled) {
      throw new UnauthorizedException('User disabled');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.jwtUtil.generateToken(user.username, user.role),
      role: user.role
    };
  }

}