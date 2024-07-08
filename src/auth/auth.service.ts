import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthCheckUsernameDto } from './dto/auth-checkUsername.dto';
import { User } from './user.entity';
import { AuthUpdateUserDto } from './dto/auth-updateUser.dto';
import { UserDto } from './dto/user.data.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    return this.userRepository.signIn(authCredentialsDto);
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
}
