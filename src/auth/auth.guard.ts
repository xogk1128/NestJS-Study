import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = this.jwtService.verify(token);
      const user: User = await this.userRepository.findOneBy({
        id: decoded.id,
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      // 토큰이 만료되었을 때 처리
      if (error.name === 'TokenExpiredError') {
        const refreshToken = request.headers['x-refresh-token'];

        if (!refreshToken) {
          throw new UnauthorizedException('Refresh token not found');
        }

        try {
          const newAccessToken =
            await this.authService.refreshToken(refreshToken);
          request.res.setHeader('x-access-token', newAccessToken);

          const decoded = this.jwtService.verify(newAccessToken);
          const user: User = await this.userRepository.findOneBy({
            id: decoded.id,
          });

          if (!user) {
            throw new UnauthorizedException('User not found');
          }

          request.user = user;
          return true;
        } catch (refreshError) {
          throw new UnauthorizedException('Refresh token invalid or expired');
        }
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
