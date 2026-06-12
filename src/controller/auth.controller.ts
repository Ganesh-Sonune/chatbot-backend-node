import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Public } from '../security/public.decorator';
import { AuthService } from '../service/auth.service';

@Controller('api/auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() request: LoginRequestDto
  ): Promise<LoginResponseDto> {

    return this.authService.login(
      request.username,
      request.password
    );
  }
}