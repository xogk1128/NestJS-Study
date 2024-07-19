import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthCheckUsernameDto } from './dto/auth-checkUsername.dto';
import { AuthUpdateUserDto } from './dto/auth-updateUser.dto';
import { UserDto } from './dto/user.data.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    dataSource: DataSource,
    private jwtService: JwtService,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
    const { username, name, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, name, password: hashedPassword });

    try {
      await this.save(user);
      return {
        message: '회원가입에 성공하였습니다.',
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing usernmae');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  //   async signIn(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
  //     const { username, password } = authCredentialsDto;

  //     const user = await this.findOne({ where: { username } });

  //     if (user && (await bcrypt.compare(password, user.password))) {
  //       const payload = { username };
  //       const accessToken = await this.jwtService.sign(payload);

  //       return {
  //         message: '로그인에 성공하였습니다.',
  //         accessToken,
  //       };
  //     } else {
  //       throw new UnauthorizedException('login failed');
  //     }
  //   }

  async checkUsername(
    authCheckUsernameDto: AuthCheckUsernameDto,
  ): Promise<Object> {
    const { username } = authCheckUsernameDto;
    const user = await this.findOne({ where: { username } });

    if (!user) {
      return { message: '사용 가능한 아이디입니다.' };
    } else {
      throw new NotFoundException('Username already exists');
    }
  }

  async withdraw(user: User): Promise<Object> {
    await this.delete(user.id);

    return {
      message: '회원탈퇴에 성공하였습니다',
    };
  }

  async modifyUser(
    user: User,
    authUpdateUserDto: AuthUpdateUserDto,
  ): Promise<Object> {
    const { name, password } = authUpdateUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.name = name;
    user.password = hashedPassword;

    await this.save(user);

    const userData = new UserDto();
    userData.name = user.name;
    userData.username = user.username;

    return {
      message: '성공적으로 변경되었습니다!',
      data: userData,
    };
  }

  // 토큰 재발급
  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.update(userId, { refreshToken });
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      return null;
    }
  }
}
