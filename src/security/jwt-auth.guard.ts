import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtUtil } from './jwt.util';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  private readonly jwtUtil = new JwtUtil();

  constructor(
private readonly reflector:Reflector,
){}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const isPublic=this.reflector.get<boolean>(
'isPublic',
context.getHandler(),
);

if(isPublic){return true;}
    const request = context
      .switchToHttp()
      .getRequest();

    const authHeader =
      request.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Missing token',
      );
    }

    const token =
      authHeader.substring(7);

    try {

      const valid =
        this.jwtUtil.isTokenValid(token);

      if (!valid) {

        throw new UnauthorizedException(
          'Invalid token',
        );
      }

      const claims =
        this.jwtUtil.getClaims(token);

      request.user = claims;

      return true;

    } catch {

      throw new UnauthorizedException(
        'JWT authentication failed',
      );
    }
  }
}