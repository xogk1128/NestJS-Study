import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthCheckUsernameDto } from './dto/auth-checkUsername.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth.guard';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { AuthUpdateUserDto } from './dto/auth-updateUser.dto';
import { UserDto } from './dto/user.data.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/check')
  checkUsername(
    @Body() authCheckUsernameDto: AuthCheckUsernameDto,
  ): Promise<Object> {
    return this.authService.checkUsername(authCheckUsernameDto);
  }

  @Get('/info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@GetUser() user: User): Promise<UserDto> {
    return this.authService.getUserInfo(user);
  }

  @Delete('/withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(@GetUser() user: User): Promise<Object> {
    return await this.authService.withdraw(user);
  }

  @Put('/modify')
  @UseGuards(JwtAuthGuard)
  async modifyUser(
    @GetUser() user: User,
    authUpdateUserDto: AuthUpdateUserDto,
  ): Promise<Object> {
    return await this.authService.modifyUser(user, authUpdateUserDto);
  }
}
