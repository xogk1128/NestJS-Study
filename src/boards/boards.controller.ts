import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPiple } from './pipes/board-status-validation.pipe';
import { Board } from './boards.entity';
import { DeleteResult } from 'typeorm';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  //   @Get()
  //   getAllBoard(): Board[] {
  //     return this.boardsService.getAllBoards();
  //   }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto);
  }

  //   @Post()
  //   @UsePipes(ValidationPipe)
  //   createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //     return this.boardsService.createBoard(createBoardDto);
  //   }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }
  //   @Get('/:id')
  //   getBoardById(@Param('id') id: String): Board {
  //     return this.boardsService.getBoardById(id);
  //   }

  @Delete('/:id')
  deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.boardsService.deleteBoard(id);
  }

  //   @Delete('/:id')
  //   deleteBoard(@Param('id') id: String) {
  //     this.boardsService.deleteBoard(id);
  //   }

  //   @Patch('/:id/status')
  //   updateBoardStatus(
  //     @Param('id') id: String,
  //     @Body('status', BoardStatusValidationPiple) status: BoardStatus,
  //   ): Board {
  //     return this.boardsService.updateBoardStatus(id, status);
  //   }
}
