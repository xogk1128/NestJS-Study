import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCheckUsernameDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
