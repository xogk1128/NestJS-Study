import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthCheckUsernameDto } from './dto/auth-checkUsername.dto';
import { User } from './user.entity';
import { AuthUpdateUserDto } from './dto/auth-updateUser.dto';
import { UserDto } from './dto/user.data.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenDto } from './dto/auth-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AuthTokenDto> {
    const user =
      await this.userRepository.validateUserPassword(authCredentialsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    const refreshToken = this.jwtService.sign(
      { id: user.id, username: user.username },
      { expiresIn: '7d' },
    );

    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async checkUsername(
    authCheckUsernameDto: AuthCheckUsernameDto,
  ): Promise<Object> {
    return this.userRepository.checkUsername(authCheckUsernameDto);
  }

  async getUserInfo(user: User): Promise<UserDto> {
    const userData = new UserDto();

    userData.name = user.name;
    userData.username = user.username;

    return userData;
  }

  async withdraw(user: User): Promise<Object> {
    return await this.userRepository.withdraw(user);
  }

  async modifyUser(
    user: User,
    authUpdateUserDto: AuthUpdateUserDto,
  ): Promise<Object> {
    return await this.userRepository.modifyUser(user, authUpdateUserDto);
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException();
      }

      const newAccessToken = this.jwtService.sign({
        id: user.id,
        username: user.username,
      });
      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
