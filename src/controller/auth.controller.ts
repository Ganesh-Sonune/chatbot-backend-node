import { Body, Controller,Post,} from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtUtil } from '../security/jwt.util';
import { Public }from '../security/public.decorator';

@Controller('api/auth')
export class AuthController {

  constructor(private readonly jwtUtil: JwtUtil,) {}

  @Public()
  @Post('login')
  login(@Body() request: LoginRequestDto,): LoginResponseDto {
    const token=this.jwtUtil.generateToken(request.username,'ROLE_ADMIN',);
    return {token,role:'ROLE_ADMIN',};
  }
  
}