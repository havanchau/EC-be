import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { UserService } from 'src/modules/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async register(@Body() body: { username: string; password: string }): Promise<any> {
    return this.userService.register({
      username: body.username,
      password: body.password,
    } as CreateUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'User logged in successfully.', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() body: { username: string; password: string }): Promise<{ accessToken: string } | null> {
    return this.userService.login({
      username: body.username,
      password: body.password,
    } as LoginUserDto);
  }
}
