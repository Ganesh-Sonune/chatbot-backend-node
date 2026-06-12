import { Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtUtil {

  private readonly secret ='mySecretKey';

  private readonly expirationTime = '1d';

  generateToken(username: string,role: string,): string {

    return jwt.sign(
      {username,role,},
      this.secret,
      {expiresIn: this.expirationTime,},
    );
  }

  extractUsername( token: string,): string {

    const decoded =
      jwt.verify(
        token,
        this.secret,
      ) as any;

    return decoded.username;
  }

  isTokenValid( token: string,): boolean {
    try {

      jwt.verify(
        token,
        this.secret,
      );

      return true;

    } catch {

      return false;
    }
  }

  getClaims(token: string,): any {

    return jwt.verify(
      token,
      this.secret,
    );
  }
}