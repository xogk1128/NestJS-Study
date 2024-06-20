import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  title: String;

  @IsNotEmpty()
  description: String;
}
